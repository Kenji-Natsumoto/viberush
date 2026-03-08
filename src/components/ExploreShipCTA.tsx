import { useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ExploreShipCTA() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "relative mx-auto max-w-4xl my-16 rounded-xl overflow-hidden transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ padding: '6px' }}
    >
      {/* Thick rainbow glow border */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(90deg, hsl(201 100% 50%), hsl(190 80% 55%), hsl(170 60% 50%), hsl(100 40% 45%), hsl(60 60% 50%), hsl(45 80% 55%), hsl(42 100% 50%), hsl(35 90% 45%))',
          backgroundSize: '300% 100%',
          animation: 'border-glow-spin 6s linear infinite',
        }}
      />
      <div
        className="relative rounded-[calc(0.75rem-6px)] px-8 py-14 md:px-16 md:py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        {/* Decorative dots */}
        <div className="absolute top-6 left-8 flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35]/60" />
          <span className="w-2 h-2 rounded-full bg-amber-400/50" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/40" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30 mb-6">
          <Rocket className="h-3.5 w-3.5" />
          THE 30sec. SHIP
        </span>

        {/* Headline */}
        <h2
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-loose transition-all duration-700 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ color: "#ffffff" }}
        >
          Ship your AI app here
          <br />
          <span
            className="bg-clip-text text-transparent pb-2 inline-block"
            style={{
              backgroundImage: "linear-gradient(90deg, #FF6B35, #fbbf24, #FF6B35)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }}
          >
            and get noticed!
          </span>
        </h2>

        {/* Sub-copy */}
        <p
          className={cn(
            "mt-4 text-sm sm:text-base max-w-lg mx-auto leading-relaxed transition-all duration-700 delay-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Connect with users, investors, and the global Vibe Coding community.
        </p>

        {/* CTA Button */}
        <div
          className={cn(
            "mt-8 transition-all duration-700 delay-500",
            visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
          )}
        >
          <button
            onClick={() => navigate("/ship-guide")}
            className="group relative inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FF6B35, #ff8c42)",
              color: "#ffffff",
            }}
          >
            🚀 Ship Your Product
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        {/* Free label */}
        <p
          className={cn(
            "mt-4 text-base font-semibold tracking-wide transition-all duration-700 delay-600",
            visible ? "opacity-100" : "opacity-0"
          )}
          style={{ color: "#FF6B35" }}
        >
          Free · No code required · 30 seconds
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
