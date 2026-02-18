import { useState } from "react";
import { Copy, Check } from "lucide-react";

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
    name: "Logo Blue",
    description: "VibeRush logo background color",
    light: { hsl: "201 100% 50%", hex: "#00A6FF" },
    dark: { hsl: "201 100% 50%", hex: "#00A6FF" },
  },
];

const technicalColors = [
  {
    name: "Sky Blue",
    hex: "#00A6FF",
    hsl: "201 100% 50%",
    description: "Primary accent and brand gradient start",
  },
  {
    name: "Gold",
    hex: "#B37D00",
    hsl: "42 100% 35%",
    description: "Secondary accent and brand gradient end",
  },
  {
    name: "Muted Cyan",
    hex: "#3C9BD4",
    hsl: "201 64% 54%",
    description: "Used for secondary tool badges",
  },
  {
    name: "Amber",
    hex: "#D49600",
    hsl: "42 100% 42%",
    description: "Used for high-priority tool badges",
  },
];

export function ColorPaletteSection() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
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

      <h2 className="text-2xl font-semibold text-foreground mt-16 mb-6">
        Technical Palette (Icons & Badges)
      </h2>
      <p className="text-muted-foreground mb-8">
        A custom gradient transition from Sky Blue to Gold, used for automated product icons and tool categorization.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {technicalColors.map((color) => (
          <div
            key={color.name}
            className="border border-border rounded-xl p-4 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-lg border border-border shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground">{color.name}</h3>
                <span className="text-xs font-mono text-muted-foreground">{color.hex}</span>
              </div>
              <p className="text-sm text-muted-foreground">{color.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
