import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Link, FileText, Play, Video, Upload, Clock, Sparkles, Mail, Github, Linkedin, User, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import { cn } from "@/lib/utils";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { TOOL_CATEGORIES, toolColors, TIME_OPTIONS } from "@/lib/toolConfig";
import { PRODUCT_CATEGORIES } from "@/lib/categoryConfig";
import type { Tool } from "@/types/database";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

type SaveStatus = "idle" | "saving" | "saved";

export default function MoreDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("product");
  const { data: product, isLoading } = useProduct(productId ?? undefined);
  const updateProduct = useUpdateProduct();
  const { user } = useAuth();

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [url, setUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [xUrlVal, setXUrlVal] = useState("");
  const [linkedinUrlVal, setLinkedinUrlVal] = useState("");
  const [githubUrlVal, setGithubUrlVal] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [makerNameVal, setMakerNameVal] = useState("");

  // Populate from product
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setTagline(product.tagline || "");
      setUrl(product.url || "");
      setDemoUrl(product.demoUrl || "");
      setVideoUrl(product.videoUrl || "");
      setIconUrl(product.iconUrl || "");
      setSelectedTools(product.tools || []);
      setSelectedTime(product.timeToBuild || "");
      setSelectedCategory(product.category || "Other");
      setAiPrompt(product.aiPrompt || "");
      setXUrlVal(product.xUrl || "");
      setLinkedinUrlVal(product.linkedinUrl || "");
      setGithubUrlVal(product.githubUrl || "");
      setContactEmail(product.contactEmail || "");
      setMakerNameVal(product.proxyCreatorName || "");
    }
  }, [product]);

  const saveField = useCallback(
    async (fields: Record<string, unknown>) => {
      if (!productId) return;
      setSaveStatus("saving");
      try {
        await updateProduct.mutateAsync({ id: productId, ...fields } as any);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("idle");
      }
    },
    [productId, updateProduct]
  );

  const toggleTool = (tool: Tool) => {
    setSelectedTools((prev) => {
      const next = prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool];
      saveField({ tools: next });
      return next;
    });
  };

  if (!productId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No product specified.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Product not found.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/product/${productId}`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Product
          </button>

          {/* Save indicator */}
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-primary">
                <Check className="h-3.5 w-3.5" /> Saved ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Make It Shine ✦</h1>
          <p className="text-muted-foreground mt-1">Add details to make your product stand out on VibeRush.</p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <span className="text-xl">✏️</span>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            Update your app details anytime. Changes are saved instantly!
          </p>
        </div>

        {/* Product Avatar section */}
        <div className="mb-6 p-5 rounded-xl border border-border bg-card space-y-3">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <Upload className="h-4 w-4 text-muted-foreground" />
            Product Avatar (Logo/Icon)
          </Label>
          <p className="text-sm text-muted-foreground">This represents the identity of your product.</p>
          <p className="text-xs text-muted-foreground/70">
            Recommended: 200×200px or larger (square). If not set, a 100×100px auto-generated icon will be used.
          </p>
          <ImageUpload
            value={iconUrl}
            onChange={(val) => {
              setIconUrl(val);
              saveField({ iconUrl: val });
            }}
            placeholder="https://yourapp.com/icon.png"
          />
        </div>

        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="links">Links & Social</TabsTrigger>
          </TabsList>

          {/* ====== Tab 1: Basics ====== */}
          <TabsContent value="basics" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="md-name" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Product Name
              </Label>
              <Input
                id="md-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => saveField({ name })}
                placeholder="Your product name"
                className="bg-secondary border-transparent focus:border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-desc" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Short Description
              </Label>
              <Textarea
                id="md-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => saveField({ description })}
                placeholder="What does your product do?"
                rows={3}
                className="bg-secondary border-transparent focus:border-border resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-tagline" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Tagline
              </Label>
              <Input
                id="md-tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                onBlur={() => saveField({ tagline })}
                placeholder="A short, catchy description"
                className="bg-secondary border-transparent focus:border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-makerName" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Maker Name
              </Label>
              <Input
                id="md-makerName"
                value={makerNameVal}
                onChange={(e) => setMakerNameVal(e.target.value)}
                onBlur={() => saveField({ proxyCreatorName: makerNameVal })}
                placeholder="e.g. Jane Doe / Team Name"
                className="bg-secondary border-transparent focus:border-border"
              />
              <p className="text-xs text-muted-foreground">プロダクトの制作者名として表示されます</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-demoUrl" className="flex items-center gap-2 text-sm font-medium">
                <Play className="h-3.5 w-3.5 text-muted-foreground" />
                Demo URL
              </Label>
              <Input
                id="md-demoUrl"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                onBlur={() => saveField({ demoUrl })}
                placeholder="https://yourapp.lovable.app"
                className="bg-secondary border-transparent focus:border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-url" className="flex items-center gap-2 text-sm font-medium">
                <Link className="h-3.5 w-3.5 text-muted-foreground" />
                Product URL
              </Label>
              <Input
                id="md-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => saveField({ url })}
                placeholder="https://yourapp.com"
                className="bg-secondary border-transparent focus:border-border"
              />
            </div>


          </TabsContent>

          {/* ====== Tab 2: Story ====== */}
          <TabsContent value="story" className="space-y-5">
            <div className="space-y-2 p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
              <Label htmlFor="md-aiPrompt" className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Share Your Magic Prompt ✨
                </span>
              </Label>
              <Textarea
                id="md-aiPrompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onBlur={() => saveField({ aiPrompt })}
                placeholder="Share the prompt that created this app"
                rows={4}
                className="bg-background border-purple-500/30 focus:border-purple-500 resize-none"
              />
            </div>

            {/* Vibe Tools */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Vibe Tools <span className="text-xs text-muted-foreground">(Select all that apply)</span>
              </Label>
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
                            "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer",
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
                    onClick={() => {
                      const next = selectedTime === time ? "" : time;
                      setSelectedTime(next);
                      saveField({ timeToBuild: next });
                    }}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer",
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

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      saveField({ category: cat });
                    }}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Video URL */}
            <div className="space-y-2 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
              <Label htmlFor="md-videoUrl" className="flex items-center gap-2 text-sm font-semibold text-orange-500">
                <Video className="h-4 w-4" />
                Video/GIF URL 🎬
              </Label>
              <Input
                id="md-videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onBlur={() => saveField({ videoUrl })}
                placeholder="https://www.loom.com/share/..."
                className="bg-background border-orange-500/30 focus:border-orange-500"
              />
            </div>
          </TabsContent>

          {/* ====== Tab 3: Links & Social ====== */}
          <TabsContent value="links" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="md-email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Contact Email
              </Label>
              <Input
                id="md-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                onBlur={() => saveField({ contactEmail })}
                placeholder="you@example.com"
                className="bg-secondary border-transparent focus:border-border"
              />
              <p className="text-xs text-muted-foreground">📧 For rankings and updates — kept private</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-x" className="flex items-center gap-2 text-sm font-medium">
                <XIcon className="h-3.5 w-3.5 text-muted-foreground" />
                X (Twitter)
              </Label>
              <Input
                id="md-x"
                value={xUrlVal}
                onChange={(e) => setXUrlVal(e.target.value)}
                onBlur={() => saveField({ xUrl: xUrlVal })}
                placeholder="https://x.com/yourhandle"
                className="bg-secondary border-transparent focus:border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-linkedin" className="flex items-center gap-2 text-sm font-medium">
                <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                LinkedIn
              </Label>
              <Input
                id="md-linkedin"
                value={linkedinUrlVal}
                onChange={(e) => setLinkedinUrlVal(e.target.value)}
                onBlur={() => saveField({ linkedinUrl: linkedinUrlVal })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="bg-secondary border-transparent focus:border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-github" className="flex items-center gap-2 text-sm font-medium">
                <Github className="h-3.5 w-3.5 text-muted-foreground" />
                GitHub
              </Label>
              <Input
                id="md-github"
                value={githubUrlVal}
                onChange={(e) => setGithubUrlVal(e.target.value)}
                onBlur={() => saveField({ githubUrl: githubUrlVal })}
                placeholder="https://github.com/yourusername"
                className="bg-secondary border-transparent focus:border-border"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
