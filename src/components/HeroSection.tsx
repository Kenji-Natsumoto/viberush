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
          Be seen.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-3 max-w-xl mx-auto">
          Your product in front of makers, investors & the global Vibe Coding community.
        </p>
        <p className="text-sm text-muted-foreground/60 mb-10">
          Free · 30 seconds · No engineers required
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onSubmitClick}
            className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          >
            🚀 Ship Your Product
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/explore")}
            className="gap-2 px-8 w-full sm:w-auto"
          >
            🔥 Explore Products
          </Button>
        </div>
      </div>
    </section>
  );
}
