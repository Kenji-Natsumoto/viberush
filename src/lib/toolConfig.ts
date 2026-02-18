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
// All colors sit within a warm-gold → teal → sky-blue gradient, low saturation (~25-35%), medium lightness
export const toolColors: Record<Tool, { bg: string; text: string; border: string }> = {
  // AI Coding Assistants — spread across the gold→blue spectrum
  Lovable:      { bg: "bg-[hsl(35,30%,42%)]",  text: "text-[hsl(35,20%,92%)]",  border: "border-[hsl(35,25%,52%)]" },
  Cursor:       { bg: "bg-[hsl(200,28%,44%)]",  text: "text-[hsl(200,15%,92%)]", border: "border-[hsl(200,22%,54%)]" },
  Bolt:         { bg: "bg-[hsl(45,32%,44%)]",   text: "text-[hsl(45,20%,92%)]",  border: "border-[hsl(45,26%,54%)]" },
  Replit:       { bg: "bg-[hsl(15,28%,44%)]",   text: "text-[hsl(15,15%,92%)]",  border: "border-[hsl(15,22%,54%)]" },
  v0:           { bg: "bg-[hsl(220,20%,38%)]",  text: "text-[hsl(220,12%,90%)]", border: "border-[hsl(220,16%,48%)]" },
  Windsurf:     { bg: "bg-[hsl(175,25%,42%)]",  text: "text-[hsl(175,15%,92%)]", border: "border-[hsl(175,20%,52%)]" },
  "Claude Code":{ bg: "bg-[hsl(210,22%,40%)]",  text: "text-[hsl(210,12%,90%)]", border: "border-[hsl(210,18%,50%)]" },
  Codex:        { bg: "bg-[hsl(165,25%,40%)]",  text: "text-[hsl(165,15%,90%)]", border: "border-[hsl(165,20%,50%)]" },
  Gemini:       { bg: "bg-[hsl(215,28%,46%)]",  text: "text-[hsl(215,15%,92%)]", border: "border-[hsl(215,22%,56%)]" },
  Devin:        { bg: "bg-[hsl(205,26%,42%)]",  text: "text-[hsl(205,15%,92%)]", border: "border-[hsl(205,20%,52%)]" },
  "volt.new":   { bg: "bg-[hsl(30,28%,44%)]",   text: "text-[hsl(30,15%,92%)]",  border: "border-[hsl(30,22%,54%)]" },
  Emergent:     { bg: "bg-[hsl(225,24%,44%)]",  text: "text-[hsl(225,14%,92%)]", border: "border-[hsl(225,18%,54%)]" },
  antigravity:  { bg: "bg-[hsl(240,20%,44%)]",  text: "text-[hsl(240,12%,92%)]", border: "border-[hsl(240,16%,54%)]" },
  Manus:        { bg: "bg-[hsl(210,25%,44%)]",  text: "text-[hsl(210,14%,92%)]", border: "border-[hsl(210,20%,54%)]" },
  Genspark:     { bg: "bg-[hsl(25,28%,44%)]",   text: "text-[hsl(25,15%,92%)]",  border: "border-[hsl(25,22%,54%)]" },
  // Frontend/Framework
  React:        { bg: "bg-[hsl(190,25%,44%)]",  text: "text-[hsl(190,15%,92%)]", border: "border-[hsl(190,20%,54%)]" },
  "Next.js":    { bg: "bg-[hsl(220,18%,36%)]",  text: "text-[hsl(220,10%,90%)]", border: "border-[hsl(220,14%,46%)]" },
  "Tailwind CSS":{ bg: "bg-[hsl(185,25%,42%)]", text: "text-[hsl(185,15%,92%)]", border: "border-[hsl(185,20%,52%)]" },
  "Shadcn UI":  { bg: "bg-[hsl(215,18%,38%)]",  text: "text-[hsl(215,10%,90%)]", border: "border-[hsl(215,14%,48%)]" },
  Expo:         { bg: "bg-[hsl(230,18%,38%)]",  text: "text-[hsl(230,10%,90%)]", border: "border-[hsl(230,14%,48%)]" },
  // Backend/Database
  Supabase:     { bg: "bg-[hsl(155,25%,40%)]",  text: "text-[hsl(155,15%,92%)]", border: "border-[hsl(155,20%,50%)]" },
  Firebase:     { bg: "bg-[hsl(40,30%,44%)]",   text: "text-[hsl(40,18%,92%)]",  border: "border-[hsl(40,24%,54%)]" },
  "AWS Amplify":{ bg: "bg-[hsl(30,28%,42%)]",   text: "text-[hsl(30,15%,92%)]",  border: "border-[hsl(30,22%,52%)]" },
  Clerk:        { bg: "bg-[hsl(235,22%,44%)]",  text: "text-[hsl(235,12%,92%)]", border: "border-[hsl(235,18%,54%)]" },
  // Automation/Integration
  n8n:          { bg: "bg-[hsl(10,26%,44%)]",   text: "text-[hsl(10,15%,92%)]",  border: "border-[hsl(10,20%,54%)]" },
  Make:         { bg: "bg-[hsl(260,20%,42%)]",  text: "text-[hsl(260,12%,92%)]", border: "border-[hsl(260,16%,52%)]" },
  Zapier:       { bg: "bg-[hsl(20,28%,44%)]",   text: "text-[hsl(20,15%,92%)]",  border: "border-[hsl(20,22%,54%)]" },
  Dify:         { bg: "bg-[hsl(210,26%,44%)]",  text: "text-[hsl(210,14%,92%)]", border: "border-[hsl(210,20%,54%)]" },
  LangChain:    { bg: "bg-[hsl(170,22%,36%)]",  text: "text-[hsl(170,12%,90%)]", border: "border-[hsl(170,18%,46%)]" },
  Flowise:      { bg: "bg-[hsl(235,24%,44%)]",  text: "text-[hsl(235,14%,92%)]", border: "border-[hsl(235,18%,54%)]" },
  Stripe:       { bg: "bg-[hsl(243,20%,44%)]",  text: "text-[hsl(243,12%,92%)]", border: "border-[hsl(243,16%,54%)]" },
  // AI Agents
  CrewAI:       { bg: "bg-[hsl(20,26%,42%)]",   text: "text-[hsl(20,15%,92%)]",  border: "border-[hsl(20,20%,52%)]" },
  // Deployment
  Vercel:       { bg: "bg-[hsl(220,16%,36%)]",  text: "text-[hsl(220,10%,90%)]", border: "border-[hsl(220,12%,46%)]" },
  Netlify:      { bg: "bg-[hsl(175,24%,40%)]",  text: "text-[hsl(175,14%,90%)]", border: "border-[hsl(175,18%,50%)]" },
  // Languages
  Python:       { bg: "bg-[hsl(205,26%,42%)]",  text: "text-[hsl(45,25%,85%)]",  border: "border-[hsl(45,28%,55%)]" },
  TypeScript:   { bg: "bg-[hsl(212,24%,42%)]",  text: "text-[hsl(212,14%,92%)]", border: "border-[hsl(212,20%,52%)]" },
  JavaScript:   { bg: "bg-[hsl(48,28%,38%)]",   text: "text-[hsl(48,30%,85%)]",  border: "border-[hsl(48,24%,50%)]" },
  Rust:         { bg: "bg-[hsl(22,22%,36%)]",   text: "text-[hsl(22,20%,80%)]",  border: "border-[hsl(22,18%,50%)]" },
  Go:           { bg: "bg-[hsl(192,26%,42%)]",  text: "text-[hsl(192,15%,92%)]", border: "border-[hsl(192,20%,52%)]" },
  SQL:          { bg: "bg-[hsl(210,24%,40%)]",  text: "text-[hsl(210,14%,92%)]", border: "border-[hsl(210,18%,50%)]" },
  // Other
  "Other Tools":{ bg: "bg-secondary",           text: "text-secondary-foreground", border: "border-border" },
};

// Time options for build time selection
export const TIME_OPTIONS = ["30 minutes", "1 hour", "2 hours", "4 hours", "1 day", "2+ days"];
