import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Tool badges for VibeRush - Glassmorphism style with brand colors
        lovable:
          "border-[#FF007A]/30 bg-[#FF007A]/90 text-white hover:bg-[#FF007A]",
        v0:
          "border-white/10 bg-[#000000]/90 text-white hover:bg-[#000000]",
        voltnew:
          "border-[#F97316]/30 bg-[#F97316]/90 text-white hover:bg-[#F97316]",
        emergent:
          "border-[#6366F1]/30 bg-[#6366F1]/90 text-white hover:bg-[#6366F1]",
        replit:
          "border-[#EF4444]/30 bg-[#EF4444]/90 text-white hover:bg-[#EF4444]",
        devin:
          "border-[#0066FF]/30 bg-[#0066FF]/90 text-white hover:bg-[#0066FF]",
        cursor:
          "border-[#00D4FF]/30 bg-[#00D4FF]/90 text-black hover:bg-[#00D4FF]",
        windsurf:
          "border-[#14B8A6]/30 bg-[#14B8A6]/90 text-white hover:bg-[#14B8A6]",
        claudecode:
          "border-[#2D2D2D]/30 bg-[#2D2D2D]/90 text-white hover:bg-[#2D2D2D]",
        codex:
          "border-[#10A37F]/30 bg-[#10A37F]/90 text-white hover:bg-[#10A37F]",
        gemini:
          "border-[#4285F4]/30 bg-[#4285F4]/90 text-white hover:bg-[#4285F4]",
        antigravity:
          "border-[#8B5CF6]/30 bg-[#8B5CF6]/90 text-white hover:bg-[#8B5CF6]",
        manus:
          "border-[#3B82F6]/30 bg-[#3B82F6]/90 text-white hover:bg-[#3B82F6]",
        genspark:
          "border-[#F97316]/30 bg-[#F97316]/90 text-white hover:bg-[#F97316]",
        bolt:
          "border-[#FACC15]/30 bg-[#FACC15]/90 text-black hover:bg-[#FACC15]",
        tool:
          "border-border/50 bg-secondary/80 text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
