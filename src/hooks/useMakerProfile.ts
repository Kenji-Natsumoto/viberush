import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DbProduct, Product, dbProductToProduct } from '@/types/database';

export interface MakerProfile {
  id: string;
  username: string;
  bio: string;
  xUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  invitedById?: string;
  invitedByUsername?: string;
  featuredProductId?: string;
  totalUpvotes: number;
  totalVibeScore: number;
  createdAt: string;
}

export interface MakerProfileData {
  profile: MakerProfile;
  products: Product[];
  featuredProduct?: Product;
}

export function useMakerProfile(username: string | undefined) {
  return useQuery({
    queryKey: ['maker-profile', username],
    queryFn: async (): Promise<MakerProfileData | null> => {
      if (!username) return null;

      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('maker_profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) return null;

      // Fetch inviter username if exists
      let invitedByUsername: string | undefined;
      if (profileData.invited_by_id) {
        const { data: inviter } = await supabase
          .from('maker_profiles')
          .select('username')
          .eq('id', profileData.invited_by_id)
          .maybeSingle();
        invitedByUsername = inviter?.username;
      }

      // Fetch all products by this maker (as user_id or owner_id)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .or(`user_id.eq.${profileData.id},owner_id.eq.${profileData.id}`)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const products = (productsData as DbProduct[]).map((p) =>
        dbProductToProduct(p, profileData.avatar_url || undefined)
      );

      // Aggregate stats
      const totalUpvotes = products.reduce((sum, p) => sum + p.votes, 0);
      const totalVibeScore = products.reduce((sum, p) => sum + p.vibeScore, 0);

      const profile: MakerProfile = {
        id: profileData.id,
        username: profileData.username,
        bio: profileData.bio || '',
        xUrl: profileData.x_url || undefined,
        linkedinUrl: profileData.linkedin_url || undefined,
        githubUrl: profileData.github_url || undefined,
        portfolioUrl: profileData.portfolio_url || undefined,
        avatarUrl: profileData.avatar_url || undefined,
        invitedById: profileData.invited_by_id || undefined,
        invitedByUsername,
        featuredProductId: profileData.featured_product_id || undefined,
        totalUpvotes,
        totalVibeScore,
        createdAt: profileData.created_at,
      };

      const featuredProduct = profileData.featured_product_id
        ? products.find((p) => p.id === profileData.featured_product_id)
        : undefined;

      return { profile, products, featuredProduct };
    },
    enabled: !!username,
  });
}
