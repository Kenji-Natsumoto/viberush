import { useState, useEffect } from "react";
import { X, Link, FileText, Play, Video, Upload, Clock, Sparkles, Mail, Github, Linkedin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { TOOL_CATEGORIES, toolColors, TIME_OPTIONS } from "@/lib/toolConfig";
import type { Tool } from "@/types/database";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
}

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

type Section = "basics" | "branding" | "build" | "contact";

export function DetailsModal({ isOpen, onClose, productId }: DetailsModalProps) {
  const { data: product } = useProduct(productId ?? undefined);
  const updateProduct = useUpdateProduct();

  const [activeSection, setActiveSection] = useState<Section>("basics");

  // Form state
  const [tagline, setTagline] = useState("");
  const [url, setUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [proxyAvatarUrl, setProxyAvatarUrl] = useState("");
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  // Populate from product
  useEffect(() => {
    if (product) {
      setTagline(product.tagline || "");
      setUrl(product.url || "");
      setDemoUrl(product.demoUrl || "");
      setVideoUrl(product.videoUrl || "");
      setIconUrl(product.iconUrl || "");
      setBannerUrl(product.bannerUrl || "");
      setProxyAvatarUrl(product.proxyAvatarUrl || "");
      setSelectedTools(product.tools || []);
      setSelectedTime(product.timeToBuild || "");
      setAiPrompt(product.aiPrompt || "");
      setContactEmail(product.contactEmail || "");
      setXUrl(product.xUrl || "");
      setLinkedinUrl(product.linkedinUrl || "");
      setGithubUrl(product.githubUrl || "");
    }
  }, [product]);

  const toggleTool = (tool: Tool) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSave = async () => {
    if (!productId) return;
    try {
      await updateProduct.mutateAsync({
        id: productId,
        tagline,
        url,
        demoUrl,
        videoUrl,
        iconUrl,
        bannerUrl,
        tools: selectedTools,
        timeToBuild: selectedTime,
        aiPrompt,
        contactEmail,
        xUrl,
        linkedinUrl,
        githubUrl,
        proxyAvatarUrl,
      });
      onClose();
    } catch (error) {
      // Error handled in mutation
    }
  };

  if (!isOpen || !productId) return null;

  const sections: { key: Section; label: string }[] = [
    { key: "basics", label: "Basics" },
    { key: "branding", label: "Branding" },
    { key: "build", label: "Build Info" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add Details</h2>
            {product && (
              <p className="text-sm text-muted-foreground">{product.name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-border px-6">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={cn(
                "px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeSection === s.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {activeSection === "basics" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="det-tagline" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Tagline
                </Label>
                <Input id="det-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A short, catchy description" className="bg-secondary border-transparent focus:border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="det-url" className="flex items-center gap-2 text-sm font-medium">
                  <Link className="h-3.5 w-3.5 text-muted-foreground" />
                  App/Product URL
                </Label>
                <Input id="det-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourapp.com" className="bg-secondary border-transparent focus:border-border" />
              </div>
              <div className="space-y-2 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                <Label htmlFor="det-demoUrl" className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Play className="h-4 w-4" />
                  Demo URL ✨
                </Label>
                <Input id="det-demoUrl" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://yourapp.lovable.app" className="bg-background border-primary/30 focus:border-primary" />
                <p className="text-xs text-muted-foreground">Share your live app so users can try it instantly!</p>
              </div>
              <div className="space-y-2 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                <Label htmlFor="det-videoUrl" className="flex items-center gap-2 text-sm font-semibold text-orange-500">
                  <Video className="h-4 w-4" />
                  Video/GIF URL 🎬
                </Label>
                <Input id="det-videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.loom.com/share/..." className="bg-background border-orange-500/30 focus:border-orange-500" />
              </div>
            </>
          )}

          {activeSection === "branding" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="det-iconUrl" className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                  Icon URL
                </Label>
                <Input id="det-iconUrl" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://yourapp.com/icon.png" className="bg-secondary border-transparent focus:border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="det-bannerUrl" className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                  Banner Image URL
                </Label>
                <Input id="det-bannerUrl" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://yourapp.com/banner.png" className="bg-secondary border-transparent focus:border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="det-proxyAvatarUrl" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Maker Avatar URL
                </Label>
                <Input id="det-proxyAvatarUrl" value={proxyAvatarUrl} onChange={(e) => setProxyAvatarUrl(e.target.value)} placeholder="https://..." className="bg-secondary border-transparent focus:border-border" />
                <p className="text-xs text-muted-foreground">Right-click the logo → Copy Image Address</p>
              </div>
            </>
          )}

          {activeSection === "build" && (
            <>
              {/* Vibe Tools */}
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
                      onClick={() => setSelectedTime(selectedTime === time ? "" : time)}
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

              {/* AI Prompt */}
              <div className="space-y-2 p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                <Label htmlFor="det-aiPrompt" className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Share Your Magic Prompt ✨
                  </span>
                </Label>
                <Textarea
                  id="det-aiPrompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Share the prompt that created this app"
                  rows={4}
                  className="bg-background border-purple-500/30 focus:border-purple-500 resize-none"
                />
              </div>
            </>
          )}

          {activeSection === "contact" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="det-email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Contact Email
                </Label>
                <Input id="det-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary border-transparent focus:border-border" />
                <p className="text-xs text-muted-foreground">📧 For rankings and updates - kept private</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="det-xUrl" className="flex items-center gap-2 text-sm font-medium">
                  <XIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  X (Twitter)
                </Label>
                <Input id="det-xUrl" value={xUrl} onChange={(e) => setXUrl(e.target.value)} placeholder="https://x.com/yourhandle" className="bg-secondary border-transparent focus:border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="det-linkedinUrl" className="flex items-center gap-2 text-sm font-medium">
                  <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                  LinkedIn
                </Label>
                <Input id="det-linkedinUrl" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="bg-secondary border-transparent focus:border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="det-githubUrl" className="flex items-center gap-2 text-sm font-medium">
                  <Github className="h-3.5 w-3.5 text-muted-foreground" />
                  GitHub
                </Label>
                <Input id="det-githubUrl" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/yourusername" className="bg-secondary border-transparent focus:border-border" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/50">
          <Button variant="outline" onClick={onClose}>
            Skip for now
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProduct.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {updateProduct.isPending ? "Saving..." : "Save details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
