import { Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function useTypewriter(text: string, speed = 40, startDelay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const startTimeout = setTimeout(() => {
      const tick = () => {
        if (i < text.length) {
          i++;
          setDisplayed(text.slice(0, i));
          timeout = setTimeout(tick, speed);
        } else {
          setDone(true);
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export function FiftyShipHero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const tagline = "Stop coding, start vibing. Explore the Golden Age of the Solo Maker.";
  const { displayed: typedTagline, done: taglineDone } = useTypewriter(tagline, 35, 1200);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden mb-10 rounded-2xl">
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
        {/* Badge - fade in first */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[hsl(0_0%_100%/0.15)] bg-[hsl(0_0%_100%/0.06)] text-[hsl(42_100%_70%)] text-xs font-semibold tracking-widest uppercase mb-6 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <Zap className="h-3 w-3" />
          Milestone
        </div>

        {/* Headline - staggered fade in */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground leading-[1.15] mb-6 transition-all duration-700 ease-out delay-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          Welcome to the{" "}
          <span className="bg-gradient-to-r from-[hsl(190_80%_60%)] via-[hsl(42_100%_65%)] to-[hsl(35_90%_55%)] bg-clip-text text-transparent">
            50-SHIP Blitz.
          </span>
        </h1>

        {/* Description - staggered fade in */}
        <div
          className="max-w-2xl mx-auto space-y-4 text-sm sm:text-base leading-relaxed text-[hsl(0_0%_100%/0.7)] transition-all duration-700 ease-out delay-500"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p>
            This is not just a gallery of apps. It is a living testament to the{" "}
            <span className="text-[hsl(0_0%_100%/0.95)] font-medium">'Agentic Individual.'</span>{" "}
            Here, you will find 50 fully functional, AI-native products built by makers who
            bypassed the friction of syntax to turn their pure intent into reality. From a golf
            mastery app to a multi-generational record store platform, this is what happens when
            we choose <span className="text-[hsl(0_0%_100%/0.95)] font-medium">Identity over Code.</span>
          </p>

          {/* Typewriter tagline */}
          <p className="text-[hsl(42_100%_70%)] font-medium min-h-[1.75em]">
            {isVisible ? typedTagline : ""}
            {isVisible && !taglineDone && (
              <span className="inline-block w-[2px] h-[1em] bg-[hsl(42_100%_70%)] ml-0.5 align-text-bottom animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
