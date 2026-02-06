import { Clock, ExternalLink, Play, Copy, Sparkles, Share2, Video, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductPageTemplate() {
  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Product Detail Page Template
      </h2>
      <p className="text-muted-foreground mb-8">
        Each product has a dedicated detail page with consistent layout and features for showcasing AI-built applications.
      </p>

      {/* Page Structure Diagram */}
      <div className="border border-border rounded-xl overflow-hidden mb-8">
        <div className="p-4 bg-secondary border-b border-border">
          <span className="text-sm font-medium text-foreground">Page Structure</span>
        </div>
        <div className="p-6 bg-card">
          {/* Mockup */}
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Back Button */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              ← Back to Home
            </div>

            {/* Hero Card */}
            <div className="border border-border rounded-2xl overflow-hidden">
              {/* Banner */}
              <div className="h-20 bg-gradient-to-r from-primary/20 to-accent/20" />
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-muted border border-border" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">App Name</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Tagline goes here</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 text-xs bg-secondary rounded">Tool</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> 2 hours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" className="gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Play className="h-3 w-3" /> Try it Now ✨
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Video className="h-3 w-3" /> Watch Demo
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-3 w-3" /> Share on X
                  </Button>
                </div>

                {/* Description placeholder */}
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                  <div className="h-3 bg-muted rounded w-3/5" />
                </div>
              </div>
            </div>

            {/* Demo Preview */}
            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
                <span className="text-xs font-medium flex items-center gap-1">
                  <Play className="h-3 w-3 text-primary" /> Live Preview
                </span>
                <span className="text-xs text-primary">Open in new tab →</span>
              </div>
              <div className="h-32 bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                iframe preview (16:9)
              </div>
            </div>

            {/* Magic Prompt */}
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    The Magic Prompt ✨
                  </span>
                </span>
                <Button variant="outline" size="sm" className="gap-1 text-xs border-purple-500/30">
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <div className="p-4">
                <div className="bg-background/50 rounded-lg p-3 border border-border">
                  <p className="text-xs font-mono text-muted-foreground">
                    "Build me an app that..."
                  </p>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Created by</p>
                <p className="text-sm font-medium">Creator Name</p>
              </div>
              <p className="text-xs text-muted-foreground">January 1, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Specifications */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Hero Card */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Hero Card</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Container: bg-card, border-border, rounded-2xl</li>
            <li>• Banner height: 192px (h-48)</li>
            <li>• Icon size: 80×80px, rounded-2xl</li>
            <li>• Padding: 24px (sm:32px)</li>
            <li>• Title: 2xl-3xl, font-bold</li>
            <li>• Tagline: lg, muted-foreground</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Action Buttons</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Edit: outline variant (owner only)</li>
            <li>• Try it Now: gradient primary→accent</li>
            <li>• Watch Demo: outline (if video exists)</li>
            <li>• Share on X: outline variant</li>
            <li>• Vibe Score & Upvote: custom components</li>
          </ul>
        </div>

        {/* Demo Preview */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Demo Preview</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Aspect ratio: 16:9 (56.25% padding-bottom)</li>
            <li>• Container: rounded-2xl, border-border</li>
            <li>• Header: bg-secondary/50, border-b</li>
            <li>• Sandbox: allow-scripts, allow-same-origin, allow-popups, allow-forms</li>
            <li>• Toggle visibility with "Try it Now" button</li>
          </ul>
        </div>

        {/* Magic Prompt */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Magic Prompt Section</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Background: gradient purple/pink/blue at 10% opacity</li>
            <li>• Border: purple-500/20</li>
            <li>• Title gradient: purple-500 → pink-500</li>
            <li>• Prompt box: font-mono, bg-background/50</li>
            <li>• One-click copy functionality</li>
          </ul>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-8 p-6 bg-secondary rounded-xl">
        <h4 className="font-semibold text-foreground mb-4">Page Features</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li>✓ Markdown description rendering (bold, lists, links, code)</li>
            <li>✓ Live demo iframe with sandbox security</li>
            <li>✓ One-click prompt copying</li>
            <li>✓ Tool badges with icons</li>
          </ul>
          <ul className="space-y-2">
            <li>✓ Time-to-build display</li>
            <li>✓ Owner-only edit button</li>
            <li>✓ Share to X (Twitter) integration</li>
            <li>✓ Creator profile with avatar and date</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
