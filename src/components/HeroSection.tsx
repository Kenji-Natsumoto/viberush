import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onSubmitClick: () => void;
}

export function HeroSection({ onSubmitClick }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:py-28">
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          Join the VibeRush.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10">
          Become a Featured Vibe Coder.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/explore")}
          className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          🔥 Explore Products
        </Button>
      </div>
    </section>
  );
}
