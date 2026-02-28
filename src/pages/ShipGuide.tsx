import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostShipOverlay } from "@/components/PostShipOverlay";
import { Download, ExternalLink, Image, Layers, CheckCircle2, Sparkles, FileText, PenTool, ChevronRight } from "lucide-react";
import bannerExample1 from "@/assets/banner-example-1.jpg";
import bannerExample2 from "@/assets/banner-example-2.jpg";
import bannerExample3 from "@/assets/banner-example-3.jpg";
import thumbnailGood from "@/assets/thumbnail-good.png";
import thumbnailBad from "@/assets/thumbnail-bad.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateProduct } from "@/hooks/useProducts";
import { fireConfetti } from "@/lib/confetti";

const CHECKLIST_URL = "/ship-checklist.csv";
const PSD_URL = "#photoshop-template";
const AI_URL = "#illustrator-template";

const editableFields = [
  { name: "Tagline", desc: "A catchy one-liner that describes your product." },
  { name: "Website URL", desc: "Link to your live product or landing page." },
  { name: "Category", desc: "AI, SaaS, Developer Tools, etc." },
  { name: "Tools Used", desc: "Lovable, Cursor, v0, Supabase, etc." },
  { name: "Hero Banner", desc: "A 1584×396 visual banner for your product page." },
  { name: "Screenshots", desc: "Up to 4 screenshots showcasing your product." },
  { name: "Magic Prompt", desc: "The initial prompt that sparked your creation." },
  { name: "Build Time", desc: "How long it took to build your product." },
];

const bannerSteps = [
  { step: "1", title: "Choose a background", desc: "Use a solid color, gradient, or subtle pattern that matches your brand." },
  { step: "2", title: "Add your product name", desc: "Place it prominently. Use a bold, readable font." },
  { step: "3", title: "Include a screenshot or icon", desc: "Show your product in action — a single, clean screenshot works best." },
  { step: "4", title: "Export at 1584×396", desc: "Save as PNG or JPG. Keep file size under 1MB for fast loading." },
];

const thumbnailTips = [
  "Use a transparent background (PNG) or a solid brand color.",
  "Keep it simple — your icon should be recognizable at 40×40px.",
  "Avoid text in the icon — it becomes illegible at small sizes.",
  "Maintain brand consistency with your hero banner.",
];

export default function ShipGuide() {
  const { user } = useAuth();
  const createProduct = useCreateProduct();
  const [name, setName] = useState("");
  const [makerName, setMakerName] = useState("");
  const [description, setDescription] = useState("");
  const [shipped, setShipped] = useState(false);
  const [shippedProductId, setShippedProductId] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Required";
    if (!description.trim()) e.description = "Required";
    if (!makerName.trim()) e.makerName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleShip = async () => {
    if (!validate()) return;
    try {
      const product = await createProduct.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        proxyCreatorName: makerName.trim(),
      });
      fireConfetti();
      setShipped(true);
      setShippedProductId(product.id);
      setShowOverlay(true);
    } catch {}
  };

  const handleReset = () => {
    setName("");
    setMakerName("");
    setDescription("");
    setShipped(false);
    setShippedProductId(null);
    setShowOverlay(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSubmitClick={() => {}} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            THE 30sec. SHIP
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            3 fields. 30 seconds. Your product goes live on VibeRush.
          </p>
        </div>

        {/* Section 1: SHIP is super easy */}
        <section className="mb-20 bg-muted -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">SHIP in 3 Fields</h2>
          </div>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            That's all it takes to publish your work to the world. No friction. No lengthy forms. Just three fields and you're live.
          </p>
          {shipped ? (
            <Card className="border border-border bg-muted/30">
              <CardContent className="p-6 sm:p-8 text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Shipped! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  Your proof is now live on VibeRush. Add more details or ship another one.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button variant="outline" onClick={handleReset}>
                    Ship another
                  </Button>
                  {shippedProductId && (
                    <Button asChild className="gap-1">
                      <a href={`/product/${shippedProductId}`}>
                        View your SHIP <ChevronRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border bg-muted/60">
              <CardContent className="p-6 sm:p-8 space-y-4">
                {!user && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠️</span>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Please <a href="/auth?mode=signup" className="underline font-medium">sign up</a> to SHIP.
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Product Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                    placeholder="e.g. VibeFlow"
                    className="bg-background border-border"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Description
                  </label>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-2 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">
                    ✏️ Keep it short and simple — describe what your product does in plain English, as if explaining it to a friend.
                  </p>
                  <Textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setErrors(p => ({ ...p, description: "" })); }}
                    placeholder="What does your app do?"
                    rows={3}
                    className="bg-background border-border resize-none"
                  />
                  {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Demo URL
                  </label>
                  <Input
                    value={makerName}
                    onChange={(e) => { setMakerName(e.target.value); setErrors(p => ({ ...p, makerName: "" })); }}
                    placeholder="e.g. https://myapp.lovable.app"
                    className="bg-background border-border"
                  />
                  {errors.makerName && <p className="text-xs text-destructive mt-1">{errors.makerName}</p>}
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleShip}
                    disabled={!user || createProduct.isPending}
                    className="gap-2"
                  >
                    {createProduct.isPending ? "Shipping..." : "SHIP →"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Section 2: Action First */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Polish It Later</h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Wanting your product to look its best is natural. But don't let perfectionism delay your launch. SHIP first — then refine from your Dashboard at your own pace.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Fields you can add or edit after SHIP:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {editableFields.map((f) => (
              <div key={f.name} className="flex items-start gap-2 p-3 rounded-lg bg-muted/40">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm font-medium text-foreground">{f.name}</span>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Checklist Spreadsheet */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">SHIP Checklist</h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Prepare everything before you SHIP. This spreadsheet organizes all the information you'll need — fill it out at your own pace, then copy-paste into VibeRush when ready.
          </p>
          {/* Preview table */}
          <div className="border border-border rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium text-foreground">Field</th>
                  <th className="text-left p-3 font-medium text-foreground">What to prepare</th>
                </tr>
              </thead>
              <tbody>
                {editableFields.slice(0, 5).map((f, i) => (
                  <tr key={f.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="p-3 font-medium text-foreground">{f.name}</td>
                    <td className="p-3 text-muted-foreground">{f.desc}</td>
                  </tr>
                ))}
                <tr className="bg-background">
                  <td className="p-3 text-muted-foreground italic" colSpan={2}>
                    + {editableFields.length - 5} more fields in the spreadsheet…
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button asChild variant="default" className="gap-2">
            <a href={CHECKLIST_URL} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              Download SHIP Checklist
            </a>
          </Button>
        </section>

        {/* Section 4: Hero Banner Guide */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Image className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Hero Banner Guide</h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your hero banner is the first thing visitors see. A well-crafted 1584 × 396px banner (4:1 ratio, LinkedIn-compatible) makes a lasting impression.
          </p>

          {/* Size spec */}
          <Card className="border border-border mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-foreground">1584 <span className="text-muted-foreground font-normal">×</span> 396</div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">4:1 aspect ratio</span>
              </div>
              <p className="text-sm text-muted-foreground">
                PNG or JPG • Under 1MB • LinkedIn-compatible dimensions
              </p>
            </CardContent>
          </Card>

          {/* Banner examples - placeholders */}
          <div className="space-y-3 mb-8">
            <p className="text-sm font-medium text-foreground">Examples of great banners:</p>
            {[
              { src: bannerExample1, alt: "DataPulse — dark blue gradient with laptop mockup showing analytics dashboard" },
              { src: bannerExample2, alt: "TaskBoard — minimal teal geometric design on white background" },
              { src: bannerExample3, alt: "FitForge — bold black and neon green with smartphone mockup" },
            ].map((banner, n) => (
              <img
                key={n}
                src={banner.src}
                alt={banner.alt}
                className="w-full rounded-lg border border-border object-cover"
                style={{ aspectRatio: "1584/396" }}
                loading="lazy"
              />
            ))}
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {bannerSteps.map((s) => (
              <div key={s.step} className="flex gap-3 p-4 rounded-lg bg-muted/40">
                <div className="h-7 w-7 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Template downloads */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button asChild variant="outline" className="gap-2">
              <a href={PSD_URL}>
                <Download className="h-4 w-4" />
                Photoshop Template (.psd)
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a href={AI_URL}>
                <Download className="h-4 w-4" />
                Illustrator Template (.ai)
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Templates include font names, sizes, and placement guides — create the perfect banner in minutes.
          </p>
        </section>

        {/* Section 5: Thumbnail Guide (Advanced) */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <PenTool className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Advanced: Thumbnail Guide</h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            For makers who want every detail polished. Your product icon (thumbnail) appears throughout VibeRush at various sizes.
          </p>

          {/* Specs */}
          <Card className="border border-border mb-8">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-foreground mb-2">Recommended specs:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Size:</strong> 256 × 256px minimum (square)</li>
                <li>• <strong>Format:</strong> PNG (with transparency) or JPG</li>
                <li>• <strong>File size:</strong> Under 500KB</li>
              </ul>
            </CardContent>
          </Card>

          {/* Good vs Bad */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Good
              </p>
              <img
                src={thumbnailGood}
                alt="Good thumbnail example — clean minimal icon with clear brand mark"
                className="aspect-square rounded-lg border border-border object-cover w-full"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <span className="text-destructive">✗</span> Avoid
              </p>
              <img
                src={thumbnailBad}
                alt="Bad thumbnail example — cluttered with too many elements and unreadable text"
                className="aspect-square rounded-lg border border-border object-cover w-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            {thumbnailTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {showOverlay && shippedProductId && (
        <PostShipOverlay
          productId={shippedProductId}
          onComplete={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}
