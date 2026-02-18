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
    label: "Languages",
    tools: ["Python", "TypeScript", "JavaScript", "Rust", "Go", "SQL"]
  },
  { 
    label: "Other", 
    tools: ["Other Tools"] 
  },
];

// Muted gold-to-sky-blue palette for Sanctuary aesthetic
// Based on the brand gradient (Sky Blue #00A6FF ↔ Gold #B37D00)
export const toolColors: Record<Tool, { bg: string; text: string; border: string }> = {
  // AI Coding Assistants — spread across the gold→blue spectrum
  Lovable:      { bg: "bg-[hsl(42,100%,35%)]",  text: "text-[hsl(42,15%,92%)]",  border: "border-[hsl(42,40%,45%)]" },
  Cursor:       { bg: "bg-[hsl(201,100%,42%)]", text: "text-[hsl(201,15%,92%)]", border: "border-[hsl(201,40%,52%)]" },
  Bolt:         { bg: "bg-[hsl(38,100%,38%)]",  text: "text-[hsl(38,15%,92%)]",  border: "border-[hsl(38,40%,48%)]" },
  Replit:       { bg: "bg-[hsl(195,100%,40%)]", text: "text-[hsl(195,15%,92%)]", border: "border-[hsl(195,40%,50%)]" },
  v0:           { bg: "bg-[hsl(220,20%,38%)]",  text: "text-[hsl(220,12%,90%)]", border: "border-[hsl(220,16%,48%)]" },
  Windsurf:     { bg: "bg-[hsl(185,100%,38%)]", text: "text-[hsl(185,15%,92%)]", border: "border-[hsl(185,40%,48%)]" },
  "Claude Code":{ bg: "bg-[hsl(210,100%,38%)]", text: "text-[hsl(210,15%,92%)]", border: "border-[hsl(210,40%,48%)]" },
  Codex:        { bg: "bg-[hsl(175,100%,38%)]", text: "text-[hsl(175,15%,92%)]", border: "border-[hsl(175,40%,48%)]" },
  Gemini:       { bg: "bg-[hsl(215,100%,42%)]", text: "text-[hsl(215,15%,92%)]", border: "border-[hsl(215,40%,52%)]" },
  Devin:        { bg: "bg-[hsl(205,100%,40%)]", text: "text-[hsl(205,15%,92%)]", border: "border-[hsl(205,40%,50%)]" },
  "volt.new":   { bg: "bg-[hsl(45,100%,35%)]",  text: "text-[hsl(45,15%,92%)]",  border: "border-[hsl(45,40%,45%)]" },
  Emergent:     { bg: "bg-[hsl(200,80%,42%)]",  text: "text-[hsl(200,14%,92%)]", border: "border-[hsl(200,40%,52%)]" },
  antigravity:  { bg: "bg-[hsl(220,30%,40%)]",  text: "text-[hsl(220,12%,92%)]", border: "border-[hsl(220,16%,50%)]" },
  Manus:        { bg: "bg-[hsl(205,80%,42%)]",  text: "text-[hsl(205,14%,92%)]", border: "border-[hsl(205,40%,52%)]" },
  Genspark:     { bg: "bg-[hsl(35,100%,38%)]",  text: "text-[hsl(35,15%,92%)]",  border: "border-[hsl(35,40%,48%)]" },
  // Frontend/Framework
  React:        { bg: "bg-[hsl(200,100%,45%)]", text: "text-[hsl(200,15%,92%)]", border: "border-[hsl(200,40%,55%)]" },
  "Next.js":    { bg: "bg-[hsl(220,18%,36%)]",  text: "text-[hsl(220,10%,90%)]", border: "border-[hsl(220,14%,46%)]" },
  "Tailwind CSS":{ bg: "bg-[hsl(195,100%,40%)]", text: "text-[hsl(195,15%,92%)]", border: "border-[hsl(195,40%,50%)]" },
  "Shadcn UI":  { bg: "bg-[hsl(215,18%,38%)]",  text: "text-[hsl(215,10%,90%)]", border: "border-[hsl(215,14%,48%)]" },
  Expo:         { bg: "bg-[hsl(230,18%,38%)]",  text: "text-[hsl(230,10%,90%)]", border: "border-[hsl(230,14%,48%)]" },
  // Backend/Database
  Supabase:     { bg: "bg-[hsl(160,100%,35%)]", text: "text-[hsl(160,15%,92%)]", border: "border-[hsl(160,40%,45%)]" },
  Firebase:     { bg: "bg-[hsl(40,100%,38%)]",  text: "text-[hsl(40,18%,92%)]",  border: "border-[hsl(40,40%,48%)]" },
  "AWS Amplify":{ bg: "bg-[hsl(30,100%,40%)]",  text: "text-[hsl(30,15%,92%)]",  border: "border-[hsl(30,40%,50%)]" },
  Clerk:        { bg: "bg-[hsl(235,22%,44%)]",  text: "text-[hsl(235,12%,92%)]", border: "border-[hsl(235,18%,54%)]" },
  // Automation/Integration
  n8n:          { bg: "bg-[hsl(15,100%,38%)]",  text: "text-[hsl(15,15%,92%)]",  border: "border-[hsl(15,40%,48%)]" },
  Make:         { bg: "bg-[hsl(260,20%,42%)]",  text: "text-[hsl(260,12%,92%)]", border: "border-[hsl(260,16%,52%)]" },
  Zapier:       { bg: "bg-[hsl(25,100%,38%)]",  text: "text-[hsl(25,15%,92%)]",  border: "border-[hsl(25,40%,48%)]" },
  Dify:         { bg: "bg-[hsl(210,40%,44%)]",  text: "text-[hsl(210,14%,92%)]", border: "border-[hsl(210,20%,54%)]" },
  LangChain:    { bg: "bg-[hsl(170,100%,32%)]", text: "text-[hsl(170,12%,90%)]", border: "border-[hsl(170,40%,42%)]" },
  Flowise:      { bg: "bg-[hsl(235,24%,44%)]",  text: "text-[hsl(235,14%,92%)]", border: "border-[hsl(235,18%,54%)]" },
  Stripe:       { bg: "bg-[hsl(243,20%,44%)]",  text: "text-[hsl(243,12%,92%)]", border: "border-[hsl(243,16%,54%)]" },
  // AI Agents
  CrewAI:       { bg: "bg-[hsl(25,100%,38%)]",  text: "text-[hsl(25,15%,92%)]",  border: "border-[hsl(25,40%,48%)]" },
  // Deployment
  Vercel:       { bg: "bg-[hsl(220,16%,36%)]",  text: "text-[hsl(220,10%,90%)]", border: "border-[hsl(220,12%,46%)]" },
  Netlify:      { bg: "bg-[hsl(180,100%,35%)]", text: "text-[hsl(180,14%,90%)]", border: "border-[hsl(180,40%,45%)]" },
  // Languages
  Python:       { bg: "bg-[hsl(205,100%,40%)]", text: "text-[hsl(45,100%,85%)]",  border: "border-[hsl(45,40%,55%)]" },
  TypeScript:   { bg: "bg-[hsl(212,100%,42%)]", text: "text-[hsl(212,14%,92%)]", border: "border-[hsl(212,40%,52%)]" },
  JavaScript:   { bg: "bg-[hsl(48,100%,35%)]",  text: "text-[hsl(48,30%,85%)]",  border: "border-[hsl(48,40%,45%)]" },
  Rust:         { bg: "bg-[hsl(22,100%,35%)]",  text: "text-[hsl(22,20%,80%)]",  border: "border-[hsl(22,40%,45%)]" },
  Go:           { bg: "bg-[hsl(192,100%,42%)]", text: "text-[hsl(192,15%,92%)]", border: "border-[hsl(192,40%,52%)]" },
  SQL:          { bg: "bg-[hsl(210,100%,40%)]", text: "text-[hsl(210,14%,92%)]", border: "border-[hsl(210,40%,50%)]" },
  // Other
  "Other Tools":{ bg: "bg-secondary",           text: "text-secondary-foreground", border: "border-border" },
};

// Time options for build time selection
export const TIME_OPTIONS = ["30 minutes", "1 hour", "2 hours", "4 hours", "1 day", "2+ days"];
