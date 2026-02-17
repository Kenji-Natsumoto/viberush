import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductScreenshots } from "@/hooks/useProductScreenshots";
import { ArrowLeft, ExternalLink, Play, Video, Copy, Check, Clock, Sparkles, Pencil, Share2, Github, Linkedin, Link2, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { ToolBadge } from "@/components/ToolBadge";
import { UpvoteButton } from "@/components/UpvoteButton";
import { VibeScoreButton } from "@/components/VibeScoreButton";
import { EditProductModal } from "@/components/EditProductModal";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/hooks/useProducts";
import { useShortUrl, useCreateShortUrl } from "@/hooks/useShortUrl";
import { dummyProducts } from "@/data/dummyProducts";
import type { Product } from "@/types/database";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Try to fetch from database first
  const { data: dbProduct, isLoading } = useProduct(id);
  const { data: shortCode } = useShortUrl(id);
  const createShortUrl = useCreateShortUrl();
  const { data: screenshots = [] } = useProductScreenshots(id);
  
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

  
  // Check if current user is the owner
  const isOwner = user && user.id === product.userId;

  const handleCopyPrompt = async () => {
    if (product.aiPrompt) {
      await navigator.clipboard.writeText(product.aiPrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  const handleShareToX = () => {
    const timeToBuildText = product.timeToBuild || "a few hours";
    const shareText = product.url
      ? `Built ${product.name} in ${timeToBuildText} with AI! Check it out on #VibeRush 🚀`
      : `Built ${product.name} in ${timeToBuildText} with AI! #VibeRush 🚀`;
    const shareUrl = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
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
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                }}
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
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name)}&backgroundColor=6366f1`;
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {product.name}
                  </h1>
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                {product.tagline && (
                  <p className="text-lg text-muted-foreground mb-4">
                    {product.tagline}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {product.tools.length > 0 && product.tools.map((tool) => (
                    <ToolBadge key={tool} tool={tool} />
                  ))}
                  {product.timeToBuild && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{product.timeToBuild}</span>
                    </div>
                  )}
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
              <VibeScoreButton score={product.vibeScore} productId={product.id} />
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
              
              <Button
                variant="outline"
                onClick={handleShareToX}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share on X
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (shortCode) {
                    const shortUrl = `${window.location.origin}/s/${shortCode}`;
                    navigator.clipboard.writeText(shortUrl);
                  } else if (id) {
                    createShortUrl.mutate(id);
                  }
                }}
                disabled={createShortUrl.isPending}
                className="gap-2"
              >
                <Link2 className="h-4 w-4" />
                {createShortUrl.isPending ? 'Creating...' : shortCode ? 'Copy Short URL' : 'Get Short URL'}
              </Button>
            </div>

            {/* Description with Markdown */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-foreground leading-relaxed mb-4">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground">{children}</li>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mt-6 mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold text-foreground mt-5 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h3>,
                  code: ({ children }) => <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {product.description}
              </ReactMarkdown>
            </div>
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

        {/* Screenshots Gallery */}
        {screenshots.length > 0 && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                Screenshots ({screenshots.length})
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {screenshots.map((ss) => (
                <img
                  key={ss.id}
                  src={ss.url}
                  alt="Screenshot"
                  className="w-full rounded-lg border border-border object-cover"
                />
              ))}
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
            onError={(e) => {
              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.userId}`;
            }}
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
