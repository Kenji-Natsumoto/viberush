import { Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onSubmitClick: () => void;
}

export function HeroSection({ onSubmitClick }: HeroSectionProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-secondary border border-border text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-upvote" />
          <span>Discover the future of software</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          Discover the{" "}
          <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text">
            AI Gold Rush.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover, launch, and upvote apps built with vibecoding.{" "}
          <span className="text-foreground font-medium">
            See what's possible when AI writes your code.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onSubmitClick}
            className="gap-2 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Rocket className="h-4 w-4" />
            Submit Your App
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 px-6"
          >
            Browse Today's Launches
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">12+</p>
            <p className="text-sm text-muted-foreground">Apps Launched</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">48</p>
            <p className="text-sm text-muted-foreground">Makers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">350+</p>
            <p className="text-sm text-muted-foreground">Upvotes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
