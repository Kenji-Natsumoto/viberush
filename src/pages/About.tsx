import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Rocket, Users, Sparkles, Heart, Terminal, Code2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { SubmitModal } from "@/components/SubmitModal";
import { DetailsModal } from "@/components/DetailsModal";

const principles = [
  {
    icon: Rocket,
    title: "Action First",
    description: "Build before you overthink. Don't fear failure—just start moving.",
    accent: "from-[hsl(42,100%,35%)] to-[hsl(35,90%,45%)]",
  },
  {
    icon: Zap,
    title: "Speed Over Perfection",
    description: "Ship at 80% and iterate. You can always improve later.",
    accent: "from-[hsl(201,100%,50%)] to-[hsl(195,80%,42%)]",
  },
  {
    icon: Users,
    title: "Symbiosis with AI",
    description: "AI is not our enemy—it's our ultimate partner. We believe in co-creation.",
    accent: "from-[hsl(190,80%,45%)] to-[hsl(170,60%,40%)]",
  },
];

const storyBlocks = [
  {
    label: "ORIGIN",
    title: "The $4,000 Mistake That Started It All",
    content:
      "My journey into AI-native development didn't start with success. It started with a $4,000 (600,000 JPY) mistake.\n\nAround June of last year, I set out to build a complex, mobile-first enterprise app. I initially chose Bubble, dedicating months and significant capital to master it. But I quickly hit a massive wall: the agonizing complexity of the editor, platform-specific quirks, and fundamentally poor adaptability for modern mobile experiences.\n\nBy late August, I had to make the most painful decision a founder can make: I abandoned my entire investment and started over from zero.",
  },
  {
    label: "FORGE",
    title: "The UI Wars & The Deep Tech Forge",
    content:
      "I refused to compromise on quality. To find the perfect foundation, I pitted the world's best AI coding agents against each other—building the exact same UI across Lovable, bolt.new, and v0. I tested them relentlessly until I found the absolute best front-end architecture.\n\nBut UI is just the surface. The real battle was under the hood.\n\nFor the next 5 months, I worked completely solo to engineer a massive data pipeline for a next-gen enterprise app. I wrestled with Supabase, built complex external API integrations, and designed robust database architectures. I wasn't just \"vibe coding\" anymore; I was building hardcore infrastructure.",
  },
  {
    label: "PURPOSE",
    title: "Why VibeRush Exists",
    content:
      "Today, my edit count stands at exactly 1,203.\n\nThose aren't just prompts. They are 1,203 scars, iterations, and breakthroughs. Through this brutal journey, I realized a hard truth: Most platforms celebrate \"toy apps\" and superficial designs. There was no place that truly honored the agonizing difference between a cool prototype and production-ready infrastructure.\n\nThat is why I built VibeRush.\n\nWe are not a gallery for templates. We are the global sanctuary for the top 1% of elite builders who understand Context, backend robustness, and true engineering grit. If you are building the real deal, welcome home.",
  },
];

export default function About() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [detailsProductId, setDetailsProductId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">VibeRush</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — MTP */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Subtle grid bg */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23888' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-secondary border border-border text-sm text-muted-foreground font-mono">
              <Terminal className="h-3.5 w-3.5" />
              <span>manifesto.md</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground mb-6">
              10,000 builders.{" "}
              <span className="bg-gradient-to-r from-[hsl(201,100%,50%)] via-[hsl(170,60%,50%)] to-[hsl(42,100%,42%)] bg-clip-text text-transparent">
                March 30.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Unleash the world's creativity through the speed of thought.
            </p>
            <p className="text-sm text-muted-foreground/60 font-mono">
              // our Massive Transformative Purpose
            </p>
          </div>
        </section>

        {/* Founder's Story */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="max-w-5xl mx-auto px-4">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-12 md:mb-16">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 border border-border">
                <Code2 className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">The Founder's Story</h2>
                <p className="text-sm text-muted-foreground font-mono mt-0.5">git log --oneline</p>
              </div>
            </div>

            {/* Story blocks */}
            <div className="space-y-8 md:space-y-12">
              {storyBlocks.map((block, i) => (
                <div key={i} className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8">
                  {/* Label column */}
                  <div className="flex md:flex-col items-center md:items-start gap-3">
                    <span className="text-xs font-mono font-bold tracking-widest text-muted-foreground/60 bg-secondary border border-border rounded px-2.5 py-1">
                      {block.label}
                    </span>
                    <div className="hidden md:block w-px flex-1 bg-border" />
                  </div>

                  {/* Content column */}
                  <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-shadow">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                      {block.title}
                    </h3>
                    <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {block.content.split("\n\n").map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature */}
            <div className="mt-12 md:mt-16 flex items-center gap-4 md:ml-[212px]">
              <div className="w-12 h-12 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-lg font-bold text-foreground">
                K
              </div>
              <div>
                <p className="font-semibold text-foreground">Kenji Natsumoto</p>
                <p className="text-sm text-muted-foreground">Founder of VibeRush · L4 Platinum Builder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Principles</h2>
              <p className="text-muted-foreground font-mono text-sm">const values = [&quot;action&quot;, &quot;speed&quot;, &quot;symbiosis&quot;]</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="group relative bg-card border border-border rounded-xl p-6 sm:p-8 text-center hover:border-foreground/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${principle.accent} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${principle.accent} mb-5`}>
                      <principle.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Flame className="h-8 w-8 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Become a Featured Vibe Coder.</h2>
            <p className="text-primary-foreground/70 mb-6 sm:mb-8 text-sm sm:text-base max-w-lg mx-auto">
              Join the sanctuary for elite builders. Ship your proof and let the work speak for itself.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              onClick={() => setIsSubmitModalOpen(true)}
            >
              <Rocket className="h-4 w-4" />
              Ship Your Proof
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Submit Modal — same as Home page */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onOpenDetails={(id) => setDetailsProductId(id)}
      />
      <DetailsModal
        isOpen={!!detailsProductId}
        onClose={() => setDetailsProductId(null)}
        productId={detailsProductId}
      />
    </div>
  );
}
