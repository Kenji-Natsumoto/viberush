import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/data/dummyProducts";

const toolVariantMap: Record<Tool, "cursor" | "lovable" | "replit" | "claude" | "v0" | "tool"> = {
  Cursor: "cursor",
  Lovable: "lovable",
  Replit: "replit",
  Claude: "claude",
  v0: "v0",
  Bolt: "tool",
  "GPT-4": "tool",
};

interface ToolBadgeProps {
  tool: Tool;
}

export function ToolBadge({ tool }: ToolBadgeProps) {
  const variant = toolVariantMap[tool] || "tool";
  
  return (
    <Badge variant={variant} className="text-[10px] font-medium">
      {tool}
    </Badge>
  );
}
