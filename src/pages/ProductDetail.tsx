import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Play, Video, Copy, Check, Clock, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolBadge } from "@/components/ToolBadge";
import { UpvoteButton } from "@/components/UpvoteButton";
import { VibeScoreButton } from "@/components/VibeScoreButton";
import { EditProductModal } from "@/components/EditProductModal";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/hooks/useProducts";
import { dummyProducts } from "@/data/dummyProducts";
import type { Product } from "@/types/database";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Try to fetch from database first
  const { data: dbProduct, isLoading } = useProduct(id);
  
  // Fallback to dummy data if not in database
  const dummyProduct = dummyProducts.find((p) => p.id === id);
  const product: Product | null = dbProduct || dummyProduct || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const vibeScore = Math.floor(parseInt(product.id) * 17 + 42) || 50;
  
  // Check if current user is the owner
  const isOwner = user && user.id === product.userId;

  const handleCopyPrompt = async () => {
    if (product.aiPrompt) {
      await navigator.clipboard.writeText(product.aiPrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
          {/* Banner */}
          {product.bannerUrl && (
            <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20 relative overflow-hidden">
              <img
                src={product.bannerUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <img
                src={product.iconUrl}
                alt={product.name}
                className="w-20 h-20 rounded-2xl object-cover border border-border"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {product.name}
                  </h1>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  {product.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {product.tools.map((tool) => (
                    <ToolBadge key={tool} tool={tool} />
                  ))}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{product.timeToBuild}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {isOwner && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit App
                </Button>
              )}
              <VibeScoreButton initialScore={vibeScore} productId={product.id} />
              <UpvoteButton initialVotes={product.votes} productId={product.id} />
              
              {product.demoUrl && (
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2"
                >
                  <Play className="h-4 w-4" />
                  {showPreview ? "Hide Preview" : "Try it Now ✨"}
                </Button>
              )}
              
              {product.videoUrl && (
                <Button
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <a href={product.videoUrl} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Watch Demo
                  </a>
                </Button>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Demo Preview */}
        {showPreview && product.demoUrl && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Live Preview</span>
              </div>
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Open in new tab <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={product.demoUrl}
                className="absolute inset-0 w-full h-full"
                title={`${product.name} Preview`}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        )}

        {/* Magic Prompt Section */}
        {product.aiPrompt && (
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  The Magic Prompt ✨
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="gap-2 border-purple-500/30 hover:bg-purple-500/10"
              >
                {promptCopied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </div>
            <div className="p-6">
              <p className="text-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap bg-background/50 rounded-lg p-4 border border-border">
                {product.aiPrompt}
              </p>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                🪄 Use this prompt with your favorite AI tool to create something similar!
              </p>
            </div>
          </div>
        )}

        {/* Creator Info */}
        <div className="flex items-center gap-4 mt-8 p-4 bg-card border border-border rounded-xl">
          <img
            src={product.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.userId}`}
            alt={product.creatorName || 'Creator'}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-sm text-muted-foreground">Created by</p>
            <p className="font-medium text-foreground">{product.creatorName || 'Vibe Coder'}</p>
          </div>
          <p className="ml-auto text-sm text-muted-foreground">
            {new Date(product.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Edit Modal */}
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={product}
          onSave={(updatedProduct) => {
            console.log("Product updated:", updatedProduct);
          }}
        />
      </main>
    </div>
  );
};

export default ProductDetail;
