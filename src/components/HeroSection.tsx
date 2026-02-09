import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onSubmitClick: () => void;
}

export function HeroSection({ onSubmitClick }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-28">
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          Join the VibeRush.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10">
          Become a Featured Vibe Coder.
        </p>

        {/* Single CTA */}
        <Button
          size="lg"
          onClick={onSubmitClick}
          className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Rocket className="h-4 w-4" />
          Ship Your Proof
        </Button>
      </div>
    </section>
  );
}
