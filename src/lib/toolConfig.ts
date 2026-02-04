import type { Tool } from "@/types/database";

// Tool categories for organized display
export const TOOL_CATEGORIES: { label: string; tools: Tool[] }[] = [
  { 
    label: "AI Coding Assistants", 
    tools: ["Lovable", "Cursor", "Bolt", "Replit", "v0", "Windsurf", "Claude Code", "Codex", "Gemini", "Devin", "volt.new", "Emergent", "antigravity", "Manus", "Genspark"] 
  },
  { 
    label: "Frontend/Framework", 
    tools: ["React", "Next.js", "Tailwind CSS", "Shadcn UI", "Expo"] 
  },
  { 
    label: "Backend/Database", 
    tools: ["Supabase", "Firebase", "AWS Amplify", "Clerk"] 
  },
  { 
    label: "Automation/Integration", 
    tools: ["n8n", "Make", "Zapier", "Dify", "LangChain", "Flowise", "Stripe"] 
  },
  { 
    label: "AI Agents", 
    tools: ["CrewAI"] 
  },
  { 
    label: "Deployment", 
    tools: ["Vercel", "Netlify"] 
  },
  { 
    label: "Other", 
    tools: ["Other Tools"] 
  },
];

// Brand colors for each tool
export const toolColors: Record<Tool, { bg: string; text: string; border: string }> = {
  // AI Coding Assistants
  Lovable: { bg: "bg-[#FF007A]", text: "text-white", border: "border-[#FF007A]" },
  Cursor: { bg: "bg-[#00D4FF]", text: "text-black", border: "border-[#00D4FF]" },
  Bolt: { bg: "bg-[#FACC15]", text: "text-black", border: "border-[#FACC15]" },
  Replit: { bg: "bg-[#EF4444]", text: "text-white", border: "border-[#EF4444]" },
  v0: { bg: "bg-[#000000]", text: "text-white", border: "border-[#000000]" },
  Windsurf: { bg: "bg-[#14B8A6]", text: "text-white", border: "border-[#14B8A6]" },
  "Claude Code": { bg: "bg-[#2D2D2D]", text: "text-white", border: "border-[#2D2D2D]" },
  Codex: { bg: "bg-[#10A37F]", text: "text-white", border: "border-[#10A37F]" },
  Gemini: { bg: "bg-[#4285F4]", text: "text-white", border: "border-[#4285F4]" },
  Devin: { bg: "bg-[#0066FF]", text: "text-white", border: "border-[#0066FF]" },
  "volt.new": { bg: "bg-[#F97316]", text: "text-white", border: "border-[#F97316]" },
  Emergent: { bg: "bg-[#6366F1]", text: "text-white", border: "border-[#6366F1]" },
  antigravity: { bg: "bg-[#8B5CF6]", text: "text-white", border: "border-[#8B5CF6]" },
  Manus: { bg: "bg-[#3B82F6]", text: "text-white", border: "border-[#3B82F6]" },
  Genspark: { bg: "bg-[#F97316]", text: "text-white", border: "border-[#F97316]" },
  // Frontend/Framework
  React: { bg: "bg-[#61DAFB]", text: "text-black", border: "border-[#61DAFB]" },
  "Next.js": { bg: "bg-[#000000]", text: "text-white", border: "border-[#000000]" },
  "Tailwind CSS": { bg: "bg-[#06B6D4]", text: "text-white", border: "border-[#06B6D4]" },
  "Shadcn UI": { bg: "bg-[#18181B]", text: "text-white", border: "border-[#18181B]" },
  Expo: { bg: "bg-[#000020]", text: "text-white", border: "border-[#000020]" },
  // Backend/Database
  Supabase: { bg: "bg-[#3ECF8E]", text: "text-white", border: "border-[#3ECF8E]" },
  Firebase: { bg: "bg-[#FFCA28]", text: "text-black", border: "border-[#FFCA28]" },
  "AWS Amplify": { bg: "bg-[#FF9900]", text: "text-black", border: "border-[#FF9900]" },
  Clerk: { bg: "bg-[#6C47FF]", text: "text-white", border: "border-[#6C47FF]" },
  // Automation/Integration
  n8n: { bg: "bg-[#EA4B71]", text: "text-white", border: "border-[#EA4B71]" },
  Make: { bg: "bg-[#6D00CC]", text: "text-white", border: "border-[#6D00CC]" },
  Zapier: { bg: "bg-[#FF4A00]", text: "text-white", border: "border-[#FF4A00]" },
  Dify: { bg: "bg-[#1677FF]", text: "text-white", border: "border-[#1677FF]" },
  LangChain: { bg: "bg-[#1C3C3C]", text: "text-white", border: "border-[#1C3C3C]" },
  Flowise: { bg: "bg-[#5865F2]", text: "text-white", border: "border-[#5865F2]" },
  Stripe: { bg: "bg-[#635BFF]", text: "text-white", border: "border-[#635BFF]" },
  // AI Agents
  CrewAI: { bg: "bg-[#FF6B35]", text: "text-white", border: "border-[#FF6B35]" },
  // Deployment
  Vercel: { bg: "bg-[#000000]", text: "text-white", border: "border-[#000000]" },
  Netlify: { bg: "bg-[#00C7B7]", text: "text-white", border: "border-[#00C7B7]" },
  // Other
  "Other Tools": { bg: "bg-secondary", text: "text-secondary-foreground", border: "border-border" },
};

// Time options for build time selection
export const TIME_OPTIONS = ["30 minutes", "1 hour", "2 hours", "4 hours", "1 day", "2+ days"];
