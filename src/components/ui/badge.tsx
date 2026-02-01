import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
        // Tool badges for VibeRush
        lovable:
          "border-transparent bg-[#FF007A] text-white",
        v0:
          "border-transparent bg-[#000000] text-white",
        voltnew:
          "border-transparent bg-[#FFD700] text-black",
        emergent:
          "border-transparent bg-[#6366F1] text-white",
        replit:
          "border-transparent bg-[#F26207] text-white",
        devin:
          "border-transparent bg-[#0066FF] text-white",
        cursor:
          "border-transparent bg-[#7C3AED] text-white",
        windsurf:
          "border-transparent bg-[#14B8A6] text-white",
        claudecode:
          "border-transparent bg-[#D97706] text-white",
        codex:
          "border-transparent bg-[#10A37F] text-white",
        gemini:
          "border-transparent bg-[#4285F4] text-white",
        antigravity:
          "border-transparent bg-[#8B5CF6] text-white",
        tool:
          "border-border bg-secondary text-secondary-foreground",
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
