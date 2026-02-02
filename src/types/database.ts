// Database types for Supabase
export type Tool = 
  | 'Lovable' 
  | 'v0' 
  | 'volt.new' 
  | 'Emergent' 
  | 'Replit' 
  | 'Devin' 
  | 'Cursor' 
  | 'Windsurf' 
  | 'Claude Code' 
  | 'Codex' 
  | 'Gemini' 
  | 'antigravity' 
  | 'Manus' 
  | 'Genspark' 
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
  user_id: string;
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
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Creator info (joined from profiles or computed)
  creatorName?: string;
  creatorAvatar?: string;
}

// Transform database product to frontend product
export function dbProductToProduct(dbProduct: DbProduct): Product {
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
    userId: dbProduct.user_id,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    // Default creator info - can be enhanced with profile data
    creatorName: 'Vibe Coder',
    creatorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbProduct.user_id}`,
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
}
