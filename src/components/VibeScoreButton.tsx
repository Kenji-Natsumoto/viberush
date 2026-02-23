import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserVibeClicks, useAddVibeClick } from "@/hooks/useProducts";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
}

interface VibeScoreButtonProps {
  score: number;
  productId: string;
  size?: "default" | "sm";
}

const PARTICLE_COLORS = [
  "#FF6B35", // Orange
  "#FFD700", // Gold
  "#FF4500", // Red-Orange
  "#FF8C00", // Dark Orange
  "#FFA500", // Orange
  "#FFEC8B", // Light Gold
];

export function VibeScoreButton({ score, productId, size = "default" }: VibeScoreButtonProps) {
  const isSmall = size === "sm";
  const { user, signInAnonymously } = useAuth();
  const { data: userVibeClicks } = useUserVibeClicks();
  const addVibeClick = useAddVibeClick();

  const hasClicked = userVibeClicks?.has(productId) ?? false;
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const clickCountRef = useRef(0);

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const particleCount = 8 + Math.min(clickCountRef.current * 2, 8);

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 0,
        y: 0,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: Math.random() * 6 + 4,
        angle: (360 / particleCount) * i + Math.random() * 30 - 15,
        velocity: Math.random() * 40 + 30,
      });
    }

    return newParticles;
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (addVibeClick.isPending) return;

    // If not logged in, auto-sign-in anonymously
    let currentUser = user;
    if (!currentUser) {
      currentUser = await signInAnonymously();
      if (!currentUser) return; // sign-in failed
    }

    // Particles every click
    clickCountRef.current += 1;
    setIsAnimating(true);
    setParticles(createParticles());

    setTimeout(() => {
      setIsAnimating(false);
      setParticles([]);
    }, 600);

    addVibeClick.mutate({ productId });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            disabled={addVibeClick.isPending}
            className={cn(
              "relative flex flex-col items-center border transition-all duration-200",
              isSmall ? "gap-0.5 px-2 py-1 rounded-lg" : "gap-1 px-3 py-2 rounded-xl",
              hasClicked
                ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50"
                : "bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30",
              "hover:from-orange-500/20 hover:to-red-500/20 hover:border-orange-500/50",
              "active:scale-95",
              isAnimating && "scale-110",
              addVibeClick.isPending && "opacity-50 cursor-not-allowed"
            )}
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

            {/* Glow effect when animating */}
            {isAnimating && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/40 to-red-500/40 blur-md animate-pulse" />
            )}

            {/* Icon - gradient filled flame */}
            <svg
              viewBox="0 0 24 24"
              className={cn(
                "transition-all duration-200",
                isSmall ? "h-3 w-3" : "h-5 w-5",
                hasClicked || isAnimating
                  ? "scale-125 drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]"
                  : ""
              )}
            >
              <defs>
                <linearGradient id={`flame-gradient-${productId}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FF4500" />
                  <stop offset="50%" stopColor="#FF8C00" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
              <path
                d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                fill={`url(#flame-gradient-${productId})`}
                stroke="none"
              />
            </svg>

            {/* Score */}
            <span
              className={cn(
                "font-bold tabular-nums transition-all duration-200",
                isSmall ? "text-[10px]" : "text-xs",
                hasClicked || isAnimating ? "text-orange-300 scale-110" : "text-orange-500"
              )}
            >
              {score}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-[180px] text-center">
          <p>🔥 Send vibes! Tap as many times as you want</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
