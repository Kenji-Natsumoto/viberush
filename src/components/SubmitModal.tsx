import { useState } from "react";
import { X, Upload, Clock, Link, Type, FileText, Play, Video, Sparkles, Mail, Github, Linkedin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateProduct } from "@/hooks/useProducts";
import { fireConfetti } from "@/lib/confetti";
import type { Tool } from "@/types/database";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TOOLS: Tool[] = ["Lovable", "Cursor", "Bolt", "Replit", "v0", "Windsurf", "Claude Code", "Codex", "Gemini", "Devin", "volt.new", "Emergent", "antigravity", "Manus", "Genspark", "Other Tools"];

const TIME_OPTIONS = ["30 minutes", "1 hour", "2 hours", "4 hours", "1 day", "2+ days"];

// Brand colors for each tool
const toolColors: Record<Tool, { bg: string; text: string; border: string }> = {
  Lovable: { bg: "bg-[#FF007A]", text: "text-white", border: "border-[#FF007A]" },
  v0: { bg: "bg-[#000000]", text: "text-white", border: "border-[#000000]" },
  "volt.new": { bg: "bg-[#F97316]", text: "text-white", border: "border-[#F97316]" },
  Emergent: { bg: "bg-[#6366F1]", text: "text-white", border: "border-[#6366F1]" },
  Replit: { bg: "bg-[#EF4444]", text: "text-white", border: "border-[#EF4444]" },
  Devin: { bg: "bg-[#0066FF]", text: "text-white", border: "border-[#0066FF]" },
  Cursor: { bg: "bg-[#00D4FF]", text: "text-black", border: "border-[#00D4FF]" },
  Windsurf: { bg: "bg-[#14B8A6]", text: "text-white", border: "border-[#14B8A6]" },
  "Claude Code": { bg: "bg-[#2D2D2D]", text: "text-white", border: "border-[#2D2D2D]" },
  Codex: { bg: "bg-[#10A37F]", text: "text-white", border: "border-[#10A37F]" },
  Gemini: { bg: "bg-[#4285F4]", text: "text-white", border: "border-[#4285F4]" },
  antigravity: { bg: "bg-[#8B5CF6]", text: "text-white", border: "border-[#8B5CF6]" },
  Manus: { bg: "bg-[#3B82F6]", text: "text-white", border: "border-[#3B82F6]" },
  Genspark: { bg: "bg-[#F97316]", text: "text-white", border: "border-[#F97316]" },
  Bolt: { bg: "bg-[#FACC15]", text: "text-black", border: "border-[#FACC15]" },
  "Other Tools": { bg: "bg-secondary", text: "text-secondary-foreground", border: "border-border" },
};

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function SubmitModal({ isOpen, onClose }: SubmitModalProps) {
  const { user } = useAuth();
  const createProduct = useCreateProduct();
  
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
  
  // New fields
  const [contactEmail, setContactEmail] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  
  // Proxy creator fields
  const [proxyCreatorName, setProxyCreatorName] = useState("");
  const [proxyAvatarUrl, setProxyAvatarUrl] = useState("");

  const toggleTool = (tool: Tool) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const resetForm = () => {
    setName("");
    setTagline("");
    setDescription("");
    setUrl("");
    setDemoUrl("");
    setVideoUrl("");
    setAiPrompt("");
    setBannerUrl("");
    setSelectedTools([]);
    setSelectedTime("");
    setContactEmail("");
    setXUrl("");
    setLinkedinUrl("");
    setGithubUrl("");
    setProxyCreatorName("");
    setProxyAvatarUrl("");
  };

  const handleSubmit = async () => {
    if (!name || !tagline || !description || !url || selectedTools.length === 0 || !selectedTime || !contactEmail) {
      return;
    }

    try {
      await createProduct.mutateAsync({
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
        contactEmail,
        xUrl: xUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        githubUrl: githubUrl || undefined,
        proxyCreatorName: proxyCreatorName || undefined,
        proxyAvatarUrl: proxyAvatarUrl || undefined,
      });
      resetForm();
      onClose();
      // Fire confetti celebration!
      fireConfetti();
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  if (!isOpen) return null;

  const isFormValid = name && tagline && description && url && selectedTools.length > 0 && selectedTime && contactEmail;

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
            Submit Your App
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
          {/* Login Required Message */}
          {!user && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠️</span>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please <a href="/auth" className="underline font-medium">sign in</a> to submit your app.
              </p>
            </div>
          )}

          {/* Reassuring Message */}
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <span className="text-green-600 dark:text-green-400 text-sm">✨</span>
            <p className="text-sm text-green-700 dark:text-green-300">
              Don't worry! You can always edit your submission later.
            </p>
          </div>

          {/* App Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              App Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VibeFlow"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Demo URL - Highlighted */}
          <div className="space-y-2 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
            <Label htmlFor="demoUrl" className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Play className="h-4 w-4" />
              Demo URL (deployed app) ✨
            </Label>
            <Input
              id="demoUrl"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://yourapp.lovable.app"
              className="bg-background border-primary/30 focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">Share your live app so users can try it instantly!</p>
          </div>

          {/* Video/GIF URL - Highlighted */}
          <div className="space-y-2 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
            <Label htmlFor="videoUrl" className="flex items-center gap-2 text-sm font-semibold text-orange-500">
              <Video className="h-4 w-4" />
              Video/GIF URL (Loom or X share link) 🎬
            </Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.loom.com/share/..."
              className="bg-background border-orange-500/30 focus:border-orange-500"
            />
            <p className="text-xs text-muted-foreground">Show off your app in action with a quick demo video!</p>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2 text-sm font-medium">
              <Link className="h-3.5 w-3.5 text-muted-foreground" />
              App URL *
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourapp.com"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Tagline *
            </Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A short, catchy description"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description * <span className="text-xs text-muted-foreground">(Markdown supported)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your app... Use **bold**, *italic*, - lists, and [links](url)"
              rows={4}
              className="bg-secondary border-transparent focus:border-border resize-none"
            />
          </div>

          {/* AI Prompt - Magic Section */}
          <div className="space-y-2 p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
            <Label htmlFor="aiPrompt" className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Share Your Magic Prompt ✨
              </span>
            </Label>
            <Textarea
              id="aiPrompt"
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

          {/* Vibe Tools */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vibe Tools * <span className="text-xs text-muted-foreground">(Select all that apply)</span></Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOOLS.map((tool) => {
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

          {/* Time to Build */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Time to Build *
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
              <Label htmlFor="proxyCreatorName" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Display Creator Name
              </Label>
              <Input
                id="proxyCreatorName"
                value={proxyCreatorName}
                onChange={(e) => setProxyCreatorName(e.target.value)}
                placeholder="e.g. VoiceNote Team"
                className="bg-background border-amber-500/30 focus:border-amber-500"
              />
              <p className="text-xs text-muted-foreground">Leave empty to use your profile name.</p>
            </div>

            {/* Creator Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="proxyAvatarUrl" className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                Creator Avatar URL
              </Label>
              <Input
                id="proxyAvatarUrl"
                value={proxyAvatarUrl}
                onChange={(e) => setProxyAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="bg-background border-amber-500/30 focus:border-amber-500"
              />
              <p className="text-xs text-muted-foreground">
                Right-click the logo on their site → Copy Image Address. Leave empty to use your profile avatar.
              </p>
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">Contact & Social Links</h3>
            
            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email *
              </Label>
              <Input
                id="contactEmail"
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
              <Label htmlFor="xUrl" className="flex items-center gap-2 text-sm font-medium">
                <XIcon className="h-3.5 w-3.5 text-muted-foreground" />
                X (Twitter)
              </Label>
              <Input
                id="xUrl"
                value={xUrl}
                onChange={(e) => setXUrl(e.target.value)}
                placeholder="https://x.com/yourhandle"
                className="bg-background border-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="flex items-center gap-2 text-sm font-medium">
                <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                LinkedIn
              </Label>
              <Input
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="bg-background border-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="flex items-center gap-2 text-sm font-medium">
                <Github className="h-3.5 w-3.5 text-muted-foreground" />
                GitHub
              </Label>
              <Input
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername"
                className="bg-background border-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label htmlFor="banner" className="flex items-center gap-2 text-sm font-medium">
              <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              Banner Image URL (optional)
            </Label>
            <Input
              id="banner"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://yourapp.com/banner.png"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!user || !isFormValid || createProduct.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {createProduct.isPending ? "Submitting..." : "Submit App"}
          </Button>
        </div>
      </div>
    </div>
  );
}
