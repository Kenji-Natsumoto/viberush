import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, Zap, Copy, Check } from "lucide-react";
import { useState } from "react";

const Brand = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleLogoDownload = () => {
    const link = document.createElement("a");
    link.href = "/viberush-logo.svg";
    link.download = "viberush-logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colors = [
    {
      name: "Primary",
      description: "Main brand color used for logos and key elements",
      light: { hsl: "240 6% 10%", hex: "#18181B" },
      dark: { hsl: "0 0% 98%", hex: "#FAFAFA" },
    },
    {
      name: "Background",
      description: "Page background color",
      light: { hsl: "0 0% 99%", hex: "#FCFCFC" },
      dark: { hsl: "240 10% 4%", hex: "#09090B" },
    },
    {
      name: "Foreground",
      description: "Primary text color",
      light: { hsl: "240 10% 4%", hex: "#09090B" },
      dark: { hsl: "0 0% 98%", hex: "#FAFAFA" },
    },
    {
      name: "Muted",
      description: "Secondary backgrounds and subtle elements",
      light: { hsl: "240 5% 96%", hex: "#F4F4F5" },
      dark: { hsl: "240 6% 14%", hex: "#27272A" },
    },
    {
      name: "Muted Foreground",
      description: "Secondary text color",
      light: { hsl: "240 4% 46%", hex: "#71717A" },
      dark: { hsl: "240 4% 60%", hex: "#A1A1AA" },
    },
    {
      name: "Border",
      description: "Border and divider color",
      light: { hsl: "240 6% 90%", hex: "#E4E4E7" },
      dark: { hsl: "240 6% 18%", hex: "#2E2E33" },
    },
    {
      name: "Upvote",
      description: "Accent color for upvote buttons",
      light: { hsl: "16 100% 60%", hex: "#FF6B35" },
      dark: { hsl: "16 100% 60%", hex: "#FF6B35" },
    },
    {
      name: "Logo Purple",
      description: "VibeRush logo background color",
      light: { hsl: "262 83% 58%", hex: "#8B5CF6" },
      dark: { hsl: "262 83% 58%", hex: "#8B5CF6" },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Brand Guidelines
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resources and guidelines for using the VibeRush brand identity
          </p>
        </div>

        {/* Logo Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Logo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Light Background */}
            <div className="border border-border rounded-xl p-8 bg-white flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#8B5CF6]">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#18181B]">
                  VibeRush
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">On light background</p>
            </div>

            {/* Dark Background */}
            <div className="border border-border rounded-xl p-8 bg-[#09090B] flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#8B5CF6]">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  VibeRush
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">On dark background</p>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-8 flex justify-center">
            <Button onClick={handleLogoDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download Logo (SVG)
            </Button>
          </div>

          {/* Logo Usage Guidelines */}
          <div className="mt-10 p-6 bg-secondary rounded-xl">
            <h3 className="font-semibold text-foreground mb-4">Usage Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Maintain clear space around the logo equal to the height of the lightning bolt icon</li>
              <li>• Do not stretch, rotate, or distort the logo</li>
              <li>• Use the purple background version on both light and dark backgrounds</li>
              <li>• Minimum size: 24px height for digital use</li>
            </ul>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Color Palette
          </h2>
          <p className="text-muted-foreground mb-8">
            VibeRush uses a minimalist, high-contrast color palette inspired by Linear's design system.
          </p>

          <div className="grid gap-4">
            {colors.map((color) => (
              <div
                key={color.name}
                className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Color Swatches */}
                <div className="flex gap-2 shrink-0">
                  <div
                    className="w-12 h-12 rounded-lg border border-border"
                    style={{ backgroundColor: color.light.hex }}
                    title="Light mode"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border border-border"
                    style={{ backgroundColor: color.dark.hex }}
                    title="Dark mode"
                  />
                </div>

                {/* Color Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{color.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {color.description}
                  </p>
                </div>

                {/* Color Values */}
                <div className="flex flex-wrap gap-2 sm:shrink-0">
                  <button
                    onClick={() => copyToClipboard(color.light.hex, `${color.name}-hex`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {copiedColor === `${color.name}-hex` ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {color.light.hex}
                  </button>
                  <button
                    onClick={() => copyToClipboard(color.light.hsl, `${color.name}-hsl`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    {copiedColor === `${color.name}-hsl` ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    HSL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Typography
          </h2>
          <p className="text-muted-foreground mb-8">
            VibeRush uses Inter as its primary typeface for its clean, modern appearance and excellent readability.
          </p>

          <div className="border border-border rounded-xl overflow-hidden">
            {/* Font Header */}
            <div className="p-6 bg-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Inter</h3>
                  <p className="text-sm text-muted-foreground">Primary Typeface</p>
                </div>
                <a
                  href="https://fonts.google.com/specimen/Inter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Get from Google Fonts →
                </a>
              </div>
            </div>

            {/* Font Weights */}
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Regular (400)</p>
                <p className="text-2xl font-normal text-foreground">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Medium (500)</p>
                <p className="text-2xl font-medium text-foreground">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Semibold (600)</p>
                <p className="text-2xl font-semibold text-foreground">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Bold (700)</p>
                <p className="text-2xl font-bold text-foreground">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            </div>
          </div>

          {/* Type Scale */}
          <div className="mt-8 border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-6">Type Scale</h3>
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">4xl / 36px</span>
                <span className="text-4xl font-bold text-foreground">Heading 1</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">2xl / 24px</span>
                <span className="text-2xl font-semibold text-foreground">Heading 2</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">xl / 20px</span>
                <span className="text-xl font-semibold text-foreground">Heading 3</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">lg / 18px</span>
                <span className="text-lg text-foreground">Large Text</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">base / 16px</span>
                <span className="text-base text-foreground">Body Text</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">sm / 14px</span>
                <span className="text-sm text-muted-foreground">Small Text</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">xs / 12px</span>
                <span className="text-xs text-muted-foreground">Extra Small</span>
              </div>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Brand;
