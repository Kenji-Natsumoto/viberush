import { useState } from "react";
import { X, Upload, Clock, Link, Type, FileText, Play, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Tool } from "@/data/dummyProducts";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TOOLS: Tool[] = ["Lovable", "v0", "volt.new", "Emergent", "Replit", "Devin", "Cursor", "Windsurf", "Claude Code", "Codex", "Gemini", "antigravity", "Manus", "Genspark", "Other Tools"];

const TIME_OPTIONS = ["30 minutes", "1 hour", "2 hours", "4 hours", "1 day", "2+ days"];

export function SubmitModal({ isOpen, onClose }: SubmitModalProps) {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const toggleTool = (tool: Tool) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  if (!isOpen) return null;

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
          {/* App Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              App Name
            </Label>
            <Input
              id="name"
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
              placeholder="https://www.loom.com/share/..."
              className="bg-background border-orange-500/30 focus:border-orange-500"
            />
            <p className="text-xs text-muted-foreground">Show off your app in action with a quick demo video!</p>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2 text-sm font-medium">
              <Link className="h-3.5 w-3.5 text-muted-foreground" />
              App URL
            </Label>
            <Input
              id="url"
              placeholder="https://yourapp.com"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Tagline
            </Label>
            <Input
              id="tagline"
              placeholder="A short, catchy description"
              className="bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your app..."
              rows={3}
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
              placeholder="Share the prompt that created this app. Help other vibe coders learn your magic!"
              rows={4}
              className="bg-background border-purple-500/30 focus:border-purple-500 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              🪄 Your prompt is a treasure map for other builders. Share the magic!
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tools Used</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOOLS.map((tool) => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
                    selectedTools.includes(tool)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                  )}
                >
                  {tool}
                </button>
              ))}
            </div>
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

          {/* Banner Image */}
          <div className="space-y-2">
            <Label htmlFor="banner" className="flex items-center gap-2 text-sm font-medium">
              <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              Banner Image URL (optional)
            </Label>
            <Input
              id="banner"
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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Submit App
          </Button>
        </div>
      </div>
    </div>
  );
}
