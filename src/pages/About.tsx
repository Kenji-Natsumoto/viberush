import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Rocket, Users, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const principles = [
  {
    icon: Rocket,
    title: "Action First",
    description: "Build before you overthink. Don't fear failure—just start moving.",
  },
  {
    icon: Zap,
    title: "Speed Over Perfection",
    description: "Ship at 80% and iterate. You can always improve later.",
  },
  {
    icon: Users,
    title: "Symbiosis with AI",
    description: "AI is not our enemy—it's our ultimate partner. We believe in co-creation.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-secondary border border-border text-sm text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-destructive" />
              <span>About VibeRush</span>
            </div>

            {/* MTP */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 px-2">
              <span className="bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent">
                "Unleash the world's creativity
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent">
                through the speed of thought."
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Our Massive Transformative Purpose
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-12 shadow-card">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Sparkles className="h-5 w-5 text-upvote" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Our Story</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  VibeRush itself was born through <span className="text-foreground font-semibold">Vibe Coding</span>—our first prototype came to life in <span className="text-foreground font-semibold">less than an hour</span>.
                </p>
                <p>
                  We know the struggle of debugging, the art of crafting the perfect prompt, and that <span className="text-foreground font-semibold">electrifying moment</span> when your vision finally takes shape.
                </p>
                <p className="text-foreground font-medium pt-4 border-t border-border">
                  We are a community that truly understands your journey and cheers for your every breakthrough.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Principles</h2>
              <p className="text-muted-foreground">The three values we live by</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-5 sm:p-6 text-center hover:shadow-card-hover transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary mb-3 sm:mb-4">
                    <principle.icon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to join the rush?</h2>
            <p className="text-primary-foreground/80 mb-6 sm:mb-8 text-sm sm:text-base">
              Showcase your Vibe Coding project to the world
            </p>
            <Link to="/">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                <Rocket className="h-4 w-4" />
                Submit Your App
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
