import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserVibeClicks, useAddVibeClick } from "@/hooks/useProducts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingPlus {
  id: number;
  x: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
}

interface VibeButtonProps {
  score: number;
  productId: string;
  size?: "default" | "sm";
}

const PARTICLE_COLORS = [
  "#FF6B35",
  "#FFD700",
  "#FF4500",
  "#FF8C00",
  "#FFA500",
  "#FFEC8B",
];

export function VibeButton({ score, productId, size = "default" }: VibeButtonProps) {
  const isSmall = size === "sm";
  const { user, signInAnonymously } = useAuth();
  const { data: userVibeClicks } = useUserVibeClicks();
  const addVibeClick = useAddVibeClick();

  const [pulsingFlames, setPulsingFlames] = useState<boolean>(false);
  const [floatingPlusses, setFloatingPlusses] = useState<FloatingPlus[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const clickCountRef = useRef(0);

  const createParticles = useCallback(() => {
    const count = 6 + Math.min(clickCountRef.current, 6);
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: Date.now() + i,
        x: 0,
        y: 0,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: Math.random() * 5 + 3,
        angle: (360 / count) * i + Math.random() * 20 - 10,
        velocity: Math.random() * 35 + 25,
      });
    }
    return arr;
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (addVibeClick.isPending) return;

    let currentUser = user;
    if (!currentUser) {
      currentUser = await signInAnonymously();
      if (!currentUser) return;
    }

    clickCountRef.current += 1;

    // Staggered flame pulse
    setPulsingFlames(true);
    setTimeout(() => setPulsingFlames(false), 400);

    // Floating +1
    const plusId = Date.now();
    const offsetX = Math.random() * 20 - 10;
    setFloatingPlusses((prev) => [...prev, { id: plusId, x: offsetX }]);
    setTimeout(() => {
      setFloatingPlusses((prev) => prev.filter((p) => p.id !== plusId));
    }, 700);

    // Particles
    setParticles(createParticles());
    setTimeout(() => setParticles([]), 600);

    addVibeClick.mutate({ productId });
  };

  return (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              disabled={addVibeClick.isPending}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "rounded-full border-0 cursor-pointer select-none",
                "bg-gradient-to-br from-[#FF6B35] to-[#FF4500]",
                "text-white font-bold shadow-lg",
                "transition-all duration-200 ease-out",
                "hover:brightness-110 hover:scale-105 hover:shadow-xl",
                "active:scale-95",
                isSmall
                  ? "min-w-[52px] min-h-[52px] px-3 py-2 gap-0.5"
                  : "min-w-[72px] min-h-[72px] px-4 py-2.5 gap-1",
                addVibeClick.isPending && "opacity-60 cursor-not-allowed"
              )}
              style={{
                boxShadow: "0 4px 20px rgba(255, 69, 0, 0.35), 0 0 40px rgba(255, 107, 53, 0.15)",
              }}
            >
              {/* Particles */}
              <div className="absolute inset-0 overflow-visible pointer-events-none">
                {particles.map((particle) => (
                  <span
                    key={particle.id}
                    className="absolute left-1/2 top-1/2 rounded-full animate-particle"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: particle.color,
                      boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                      "--particle-angle": `${particle.angle}deg`,
                      "--particle-velocity": `${particle.velocity}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>

              {/* Floating +1 */}
              {floatingPlusses.map((fp) => (
                <span
                  key={fp.id}
                  className="absolute pointer-events-none font-bold text-white animate-float-up"
                  style={{
                    top: "-4px",
                    left: `calc(50% + ${fp.x}px)`,
                    fontSize: isSmall ? "14px" : "18px",
                    textShadow: "0 0 8px rgba(255,165,0,0.8), 0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  +1
                </span>
              ))}

              {/* Three Flames */}
              <div className={cn("flex items-end justify-center", isSmall ? "gap-0" : "gap-0.5")}>
                {/* Left flame (smaller) */}
                <svg
                  viewBox="0 0 24 24"
                  className={cn(
                    "animate-flame-idle",
                    isSmall ? "h-3 w-3" : "h-4 w-4",
                    pulsingFlames && "animate-flame-pulse-left"
                  )}
                  style={{ filter: "drop-shadow(0 0 4px rgba(255,200,0,0.6))" }}
                >
                  <path
                    d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                    fill="white"
                    opacity="0.85"
                  />
                </svg>

                {/* Center flame (largest) */}
                <svg
                  viewBox="0 0 24 24"
                  className={cn(
                    "animate-flame-idle-center",
                    isSmall ? "h-5 w-5" : "h-6 w-6",
                    pulsingFlames && "animate-flame-pulse-center"
                  )}
                  style={{ filter: "drop-shadow(0 0 6px rgba(255,200,0,0.8))" }}
                >
                  <path
                    d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                    fill="white"
                  />
                </svg>

                {/* Right flame (smaller) */}
                <svg
                  viewBox="0 0 24 24"
                  className={cn(
                    "animate-flame-idle-reverse",
                    isSmall ? "h-3 w-3" : "h-4 w-4",
                    pulsingFlames && "animate-flame-pulse-right"
                  )}
                  style={{ filter: "drop-shadow(0 0 4px rgba(255,200,0,0.6))" }}
                >
                  <path
                    d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                    fill="white"
                    opacity="0.85"
                  />
                </svg>
              </div>

              {/* Count */}
              <span
                className={cn(
                  "tabular-nums leading-none",
                  isSmall ? "text-sm" : "text-lg"
                )}
              >
                {score}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "uppercase tracking-wider leading-none",
                  isSmall ? "text-[8px]" : "text-[10px]"
                )}
              >
                VIBE IT!
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-[200px] text-center">
            <p>Send your vibe — no account needed 🔥</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Subtext below button */}
      <span
        className={cn(
          "text-muted-foreground text-center mt-1 whitespace-nowrap",
          isSmall ? "text-[11px]" : "text-[13px]"
        )}
      >
        No login · Unlimited vibes
      </span>
    </div>
  );
}
