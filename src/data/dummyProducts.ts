export type Tool = 'Lovable' | 'v0' | 'volt.new' | 'Emergent' | 'Replit' | 'Devin' | 'Cursor' | 'Windsurf' | 'Claude Code' | 'Codex' | 'Gemini' | 'antigravity' | 'Manus' | 'Genspark' | 'Other Tools';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  iconUrl: string;
  bannerUrl?: string;
  tools: Tool[];
  timeToBuild: string;
  votes: number;
  createdAt: string;
  creatorName: string;
  creatorAvatar: string;
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'VibeFlow',
    tagline: 'AI-powered project management for indie hackers',
    description: 'A sleek project management tool that uses AI to automatically prioritize tasks and suggest workflows.',
    url: 'https://vibeflow.app',
    iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=vibeflow&backgroundColor=6366f1',
    tools: ['Lovable', 'Claude Code'],
    timeToBuild: '2 hours',
    votes: 284,
    createdAt: '2024-01-15',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  },
  {
    id: '2',
    name: 'CodeBuddy',
    tagline: 'Your AI pair programmer in the browser',
    description: 'Real-time code assistance and debugging powered by Claude.',
    url: 'https://codebuddy.dev',
    iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=codebuddy&backgroundColor=10b981',
    tools: ['Cursor', 'Claude Code', 'v0'],
    timeToBuild: '4 hours',
    votes: 198,
    createdAt: '2024-01-14',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  },
  {
    id: '3',
    name: 'PromptVault',
    tagline: 'Save, organize, and share your best prompts',
    description: 'A beautiful prompt library with version control and team collaboration.',
    url: 'https://promptvault.io',
    iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=promptvault&backgroundColor=f59e0b',
    tools: ['Replit', 'Gemini'],
    timeToBuild: '1 day',
    votes: 156,
    createdAt: '2024-01-13',
    creatorName: 'Jordan Lee',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
  },
  {
    id: '4',
    name: 'LaunchKit',
    tagline: 'Ship your landing page in 10 minutes',
    description: 'AI-generated landing pages with conversion-optimized copy.',
    url: 'https://launchkit.co',
    iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=launchkit&backgroundColor=ec4899',
    tools: ['Lovable', 'Claude Code', 'v0'],
    timeToBuild: '30 minutes',
    votes: 142,
    createdAt: '2024-01-12',
    creatorName: 'Emma Watson',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
  },
  {
    id: '5',
    name: 'DataStory',
    tagline: 'Turn spreadsheets into beautiful dashboards',
    description: 'Upload a CSV and get an instant interactive dashboard with AI insights.',
    url: 'https://datastory.app',
    iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=datastory&backgroundColor=3b82f6',
    tools: ['volt.new', 'Devin'],
    timeToBuild: '6 hours',
    votes: 128,
    createdAt: '2024-01-11',
    creatorName: 'Mike Johnson',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
  },
  {
    id: '6',
    name: 'VoiceNote AI',
    tagline: 'Voice memos that transcribe and summarize themselves',
    description: 'Record ideas on the go and get organized summaries automatically.',
    url: 'https://voicenote.ai',
    iconUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=voicenote&backgroundColor=8b5cf6',
    tools: ['Cursor', 'Lovable'],
    timeToBuild: '3 hours',
    votes: 115,
    createdAt: '2024-01-10',
    creatorName: 'Lisa Park',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
  },
];
