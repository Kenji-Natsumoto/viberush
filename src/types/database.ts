// Database types for Supabase
export type Tool = 
  // AI Coding Assistants
  | 'Lovable' 
  | 'Cursor' 
  | 'Bolt'
  | 'Replit' 
  | 'v0' 
  | 'Windsurf' 
  | 'Claude Code' 
  | 'Codex' 
  | 'Gemini' 
  | 'Devin'
  | 'volt.new' 
  | 'Emergent' 
  | 'antigravity' 
  | 'Manus' 
  | 'Genspark' 
  // Frontend/Framework
  | 'React'
  | 'Next.js'
  | 'Tailwind CSS'
  | 'Shadcn UI'
  | 'Expo'
  // Backend/Database
  | 'Supabase'
  | 'Firebase'
  | 'AWS Amplify'
  | 'Clerk'
  // Automation/Integration
  | 'n8n'
  | 'Make'
  | 'Zapier'
  | 'Dify'
  | 'LangChain'
  | 'Flowise'
  | 'Stripe'
  // AI Agents
  | 'CrewAI'
  // Deployment
  | 'Vercel'
  | 'Netlify'
  | 'Other Tools';

export interface DbProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  icon_url: string;
  banner_url?: string | null;
  demo_url?: string | null;
  video_url?: string | null;
  ai_prompt?: string | null;
  tools_used: Tool[];
  time_to_build: string;
  votes_count: number;
  vibe_score: number;
  user_id: string;
  contact_email: string;
  x_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  proxy_creator_name?: string | null;
  proxy_avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

// Frontend-friendly product interface (camelCase)
export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  iconUrl: string;
  bannerUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  aiPrompt?: string;
  tools: Tool[];
  timeToBuild: string;
  votes: number;
  vibeScore: number;
  userId: string;
  contactEmail: string;
  xUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  proxyCreatorName?: string;
  proxyAvatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Creator display info (computed from proxy or profile)
  creatorName?: string;
  creatorAvatar?: string;
}

// Transform database product to frontend product
export function dbProductToProduct(dbProduct: DbProduct): Product {
  // Default avatar based on user_id
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbProduct.user_id}`;
  
  // Use proxy values if provided, otherwise fall back to defaults
  // In future, these defaults can be enhanced with profile data
  const creatorName = dbProduct.proxy_creator_name || 'Vibe Coder';
  const creatorAvatar = dbProduct.proxy_avatar_url || defaultAvatar;

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    tagline: dbProduct.tagline,
    description: dbProduct.description,
    url: dbProduct.url,
    iconUrl: dbProduct.icon_url,
    bannerUrl: dbProduct.banner_url ?? undefined,
    demoUrl: dbProduct.demo_url ?? undefined,
    videoUrl: dbProduct.video_url ?? undefined,
    aiPrompt: dbProduct.ai_prompt ?? undefined,
    tools: dbProduct.tools_used,
    timeToBuild: dbProduct.time_to_build,
    votes: dbProduct.votes_count,
    vibeScore: dbProduct.vibe_score ?? 0,
    userId: dbProduct.user_id,
    contactEmail: dbProduct.contact_email,
    xUrl: dbProduct.x_url ?? undefined,
    linkedinUrl: dbProduct.linkedin_url ?? undefined,
    githubUrl: dbProduct.github_url ?? undefined,
    proxyCreatorName: dbProduct.proxy_creator_name ?? undefined,
    proxyAvatarUrl: dbProduct.proxy_avatar_url ?? undefined,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    // Computed display values
    creatorName,
    creatorAvatar,
  };
}

// Product creation input
export interface CreateProductInput {
  name: string;
  tagline: string;
  description: string;
  url: string;
  iconUrl?: string;
  bannerUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  aiPrompt?: string;
  tools: Tool[];
  timeToBuild: string;
  contactEmail: string;
  xUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  proxyCreatorName?: string;
  proxyAvatarUrl?: string;
}

// Product update input
export interface UpdateProductInput {
  name?: string;
  tagline?: string;
  description?: string;
  url?: string;
  iconUrl?: string;
  bannerUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  aiPrompt?: string;
  tools?: Tool[];
  timeToBuild?: string;
  contactEmail?: string;
  xUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  proxyCreatorName?: string;
  proxyAvatarUrl?: string;
}
