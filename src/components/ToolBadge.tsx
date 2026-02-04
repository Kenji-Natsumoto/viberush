import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/types/database";
import { toolColors } from "@/lib/toolConfig";
import { cn } from "@/lib/utils";

interface ToolBadgeProps {
  tool: Tool;
}

export function ToolBadge({ tool }: ToolBadgeProps) {
  const colors = toolColors[tool] || toolColors["Other Tools"];
  
  return (
    <Badge 
      className={cn(
        "text-[10px] font-medium border",
        colors.bg,
        colors.text,
        colors.border
      )}
    >
      {tool}
    </Badge>
  );
}
