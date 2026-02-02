import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/types/database";

const toolVariantMap: Record<Tool, "lovable" | "v0" | "voltnew" | "emergent" | "replit" | "devin" | "cursor" | "windsurf" | "claudecode" | "codex" | "gemini" | "antigravity" | "manus" | "genspark" | "bolt" | "tool"> = {
  Lovable: "lovable",
  v0: "v0",
  "volt.new": "voltnew",
  Emergent: "emergent",
  Replit: "replit",
  Devin: "devin",
  Cursor: "cursor",
  Windsurf: "windsurf",
  "Claude Code": "claudecode",
  Codex: "codex",
  Gemini: "gemini",
  antigravity: "antigravity",
  Manus: "manus",
  Genspark: "genspark",
  Bolt: "bolt",
  "Other Tools": "tool",
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
