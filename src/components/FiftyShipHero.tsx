import { Zap } from "lucide-react";

export function FiftyShipHero() {
  return (
    <section className="relative overflow-hidden mb-10">
      {/* Background with subtle grid + glow */}
      <div className="absolute inset-0 bg-foreground rounded-2xl" />
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Neon accent glow - top-right */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[hsl(190_80%_55%)] opacity-[0.12] blur-[80px] pointer-events-none" />
      {/* Neon accent glow - bottom-left */}
      <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[hsl(42_100%_50%)] opacity-[0.10] blur-[70px] pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-10 py-14 sm:py-20 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[hsl(0_0%_100%/0.15)] bg-[hsl(0_0%_100%/0.06)] text-[hsl(42_100%_70%)] text-xs font-semibold tracking-widest uppercase mb-6">
          <Zap className="h-3 w-3" />
          Milestone
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground leading-[1.15] mb-6">
          Welcome to the{" "}
          <span className="bg-gradient-to-r from-[hsl(190_80%_60%)] via-[hsl(42_100%_65%)] to-[hsl(35_90%_55%)] bg-clip-text text-transparent">
            50-SHIP Blitz.
          </span>
        </h1>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-4 text-sm sm:text-base leading-relaxed text-[hsl(0_0%_100%/0.7)]">
          <p>
            This is not just a gallery of apps. It is a living testament to the{" "}
            <span className="text-[hsl(0_0%_100%/0.95)] font-medium">'Agentic Individual.'</span>{" "}
            Here, you will find 50 fully functional, AI-native products built by makers who
            bypassed the friction of syntax to turn their pure intent into reality. From a golf
            mastery app to a multi-generational record store platform, this is what happens when
            we choose <span className="text-[hsl(0_0%_100%/0.95)] font-medium">Identity over Code.</span>
          </p>
          <p className="text-[hsl(42_100%_70%)] font-medium">
            Stop coding, start vibing. Explore the Golden Age of the Solo Maker.
          </p>
        </div>
      </div>
    </section>
  );
}
