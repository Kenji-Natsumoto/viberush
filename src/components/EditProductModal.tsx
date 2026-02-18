import { useState, useEffect } from "react";
import { X, Upload, Clock, Link, Type, FileText, Play, Video, Sparkles, Mail, Github, Linkedin, User, Tag } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUpdateProduct } from "@/hooks/useProducts";
import { TOOL_CATEGORIES, toolColors, TIME_OPTIONS } from "@/lib/toolConfig";
import { PRODUCT_CATEGORIES } from "@/lib/categoryConfig";
import type { Tool, Product } from "@/types/database";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave?: (updatedProduct: Partial<Product>) => void;
}

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function EditProductModal({ isOpen, onClose, product, onSave }: EditProductModalProps) {
  const updateProduct = useUpdateProduct();
  
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Contact fields
  const [contactEmail, setContactEmail] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  
  // Proxy creator fields
  const [proxyCreatorName, setProxyCreatorName] = useState("");
  const [proxyAvatarUrl, setProxyAvatarUrl] = useState("");
  const [category, setCategory] = useState("Other");

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setName(product.name);
      setTagline(product.tagline);
      setDescription(product.description);
      setUrl(product.url);
      setDemoUrl(product.demoUrl || "");
      setVideoUrl(product.videoUrl || "");
      setAiPrompt(product.aiPrompt || "");
      setBannerUrl(product.bannerUrl || "");
      setSelectedTools(product.tools);
      setSelectedTime(product.timeToBuild);
      setContactEmail(product.contactEmail || "");
      setXUrl(product.xUrl || "");
      setLinkedinUrl(product.linkedinUrl || "");
      setGithubUrl(product.githubUrl || "");
      setProxyCreatorName(product.proxyCreatorName || "");
      setProxyAvatarUrl(product.proxyAvatarUrl || "");
      setCategory(product.category || "Other");
    }
  }, [product]);

  const toggleTool = (tool: Tool) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSave = async () => {
    if (!product) return;

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        name,
        tagline,
        description,
        url,
        demoUrl,
        videoUrl,
        aiPrompt,
        bannerUrl,
        tools: selectedTools,
        timeToBuild: selectedTime,
        category,
        contactEmail,
        xUrl,
        linkedinUrl,
        githubUrl,
        proxyCreatorName,
        proxyAvatarUrl,
      });
      
      if (onSave) {
        onSave({
          id: product.id,
          name,
          tagline,
          description,
          url,
          demoUrl: demoUrl || undefined,
          videoUrl: videoUrl || undefined,
          aiPrompt: aiPrompt || undefined,
          bannerUrl: bannerUrl || undefined,
          tools: selectedTools,
          timeToBuild: selectedTime,
          contactEmail: contactEmail || undefined,
          xUrl: xUrl || undefined,
          linkedinUrl: linkedinUrl || undefined,
          githubUrl: githubUrl || undefined,
          proxyCreatorName: proxyCreatorName || undefined,
          proxyAvatarUrl: proxyAvatarUrl || undefined,
        });
      }
      
      onClose();
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Edit Your App
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Reassuring Message */}
          <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400 text-sm">✏️</span>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Update your app details anytime. Changes are saved instantly!
            </p>
          </div>

          {/* App Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              App Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VibeFlow"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Demo URL - Highlighted */}
          <div className="space-y-2 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
            <Label htmlFor="edit-demoUrl" className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Play className="h-4 w-4" />
              Demo URL (deployed app) ✨
            </Label>
            <Input
              id="edit-demoUrl"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://yourapp.lovable.app"
              className="bg-background border-primary/30 focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">Share your live app so users can try it instantly!</p>
          </div>

          {/* Video/GIF URL - Highlighted */}
          <div className="space-y-2 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
            <Label htmlFor="edit-videoUrl" className="flex items-center gap-2 text-sm font-semibold text-orange-500">
              <Video className="h-4 w-4" />
              Video/GIF URL (Loom or X share link) 🎬
            </Label>
            <Input
              id="edit-videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.loom.com/share/..."
              className="bg-background border-orange-500/30 focus:border-orange-500"
            />
            <p className="text-xs text-muted-foreground">Show off your app in action with a quick demo video!</p>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-url" className="flex items-center gap-2 text-sm font-medium">
              <Link className="h-3.5 w-3.5 text-muted-foreground" />
              App URL
            </Label>
            <Input
              id="edit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourapp.com"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="edit-tagline" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Tagline
            </Label>
            <Input
              id="edit-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A short, catchy description"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              Description <span className="text-xs text-muted-foreground">(Markdown supported)</span>
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your app... Use **bold**, *italic*, - lists, and [links](url)"
              rows={4}
              className="bg-secondary border-transparent focus:border-border resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Category
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* AI Prompt - Magic Section */}
          <div className="space-y-2 p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
            <Label htmlFor="edit-aiPrompt" className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Share Your Magic Prompt ✨
              </span>
            </Label>
            <Textarea
              id="edit-aiPrompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Share the prompt that created this app. Help other vibe coders learn your magic!"
              rows={4}
              className="bg-background border-purple-500/30 focus:border-purple-500 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              🪄 Your prompt is a treasure map for other builders. Share the magic!
            </p>
          </div>

          {/* Vibe Tools - Categorized */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Vibe Tools <span className="text-xs text-muted-foreground">(Select all that apply)</span></Label>
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.label} className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">{category.label}</p>
                <div className="flex flex-wrap gap-2">
                  {category.tools.map((tool) => {
                    const isSelected = selectedTools.includes(tool);
                    const colors = toolColors[tool];
                    return (
                      <button
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
                          isSelected
                            ? `${colors.bg} ${colors.text} ${colors.border}`
                            : "bg-secondary text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                        )}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Time to Build */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Time to Build
            </Label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
                    selectedTime === time
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Creator Info Section (for Proxy Posting) */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20">
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Creator Info (Optional - for Proxy Posting)
            </h3>
            <p className="text-xs text-muted-foreground">
              Submitting on behalf of someone else? Add their info below.
            </p>
            
            {/* Display Creator Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-proxyCreatorName" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Display Creator Name
              </Label>
              <Input
                id="edit-proxyCreatorName"
                value={proxyCreatorName}
                onChange={(e) => setProxyCreatorName(e.target.value)}
                placeholder="e.g. VoiceNote Team"
                className="bg-background border-amber-500/30 focus:border-amber-500"
              />
              <p className="text-xs text-muted-foreground">Leave empty to use your profile name.</p>
            </div>

            {/* Creator Avatar */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                Creator Avatar
              </Label>
              <ImageUpload value={proxyAvatarUrl} onChange={setProxyAvatarUrl} placeholder="https://... or upload" />
              <p className="text-xs text-muted-foreground">
                Upload an avatar or paste a URL. Leave empty to use your profile avatar.
              </p>
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">Contact & Social Links</h3>
            
            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="edit-contactEmail" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="edit-contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-background border-blue-500/30 focus:border-blue-500"
              />
              <p className="text-xs text-muted-foreground">📧 For rankings and updates - kept private</p>
            </div>

            {/* X (Twitter) */}
            <div className="space-y-2">
              <Label htmlFor="edit-xUrl" className="flex items-center gap-2 text-sm font-medium">
                <XIcon className="h-3.5 w-3.5 text-muted-foreground" />
                X (Twitter)
              </Label>
              <Input
                id="edit-xUrl"
                value={xUrl}
                onChange={(e) => setXUrl(e.target.value)}
                placeholder="https://x.com/yourhandle"
                className="bg-background border-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="edit-linkedinUrl" className="flex items-center gap-2 text-sm font-medium">
                <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                LinkedIn
              </Label>
              <Input
                id="edit-linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="bg-background border-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="edit-githubUrl" className="flex items-center gap-2 text-sm font-medium">
                <Github className="h-3.5 w-3.5 text-muted-foreground" />
                GitHub
              </Label>
              <Input
                id="edit-githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername"
                className="bg-background border-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              Banner Image (optional)
            </Label>
            <ImageUpload value={bannerUrl} onChange={setBannerUrl} placeholder="https://... or upload" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateProduct.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
