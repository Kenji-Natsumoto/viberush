import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DbProduct, Product, dbProductToProduct } from '@/types/database';

export interface MakerProfile {
  id: string;
  username: string;
  displayName: string;
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
        .ilike('username', username)
        .maybeSingle();

      if (profileError) throw profileError;

      // ── Registered maker ──
      if (profileData) {
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

        // Fetch all products by this maker
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .or(`and(user_id.eq.${profileData.id},proxy_creator_name.is.null),and(user_id.eq.${profileData.id},proxy_creator_name.eq.),owner_id.eq.${profileData.id},proxy_creator_name.ilike.${profileData.username}`)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        const products = (productsData as DbProduct[]).map((p) =>
          dbProductToProduct(p, profileData.avatar_url || undefined)
        );

        const totalUpvotes = products.reduce((sum, p) => sum + p.votes, 0);
        const totalVibeScore = products.reduce((sum, p) => sum + p.vibeScore, 0);

        // Derive display name from products' proxy_creator_name or fallback to username
        const displayName = products.find(p => p.proxyCreatorName)?.proxyCreatorName || profileData.username;

        const profile: MakerProfile = {
          id: profileData.id,
          username: profileData.username,
          displayName,
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
      }

      // ── Virtual profile for unregistered proxy creators ──
      const { data: proxyProducts, error: proxyError } = await supabase
        .from('products')
        .select('*')
        .ilike('proxy_creator_name', username)
        .order('created_at', { ascending: false });

      if (proxyError) throw proxyError;
      if (!proxyProducts || proxyProducts.length === 0) return null;

      const products = (proxyProducts as DbProduct[]).map((p) => dbProductToProduct(p));

      const totalUpvotes = products.reduce((sum, p) => sum + p.votes, 0);
      const totalVibeScore = products.reduce((sum, p) => sum + p.vibeScore, 0);

      // Use proxy_avatar_url from the first product that has one,
      // or fall back to the product's creatorAvatar (DiceBear seeded by user_id) for consistency with ProductDetail
      const avatarFromProduct = proxyProducts.find((p) => p.proxy_avatar_url)?.proxy_avatar_url;
      const displayName = proxyProducts[0].proxy_creator_name || username;
      const fallbackAvatar = products[0]?.creatorAvatar;

      const profile: MakerProfile = {
        id: `virtual-${username}`,
        username: displayName,
        displayName,
        bio: '',
        avatarUrl: avatarFromProduct || fallbackAvatar || undefined,
        totalUpvotes,
        totalVibeScore,
        createdAt: proxyProducts[proxyProducts.length - 1].created_at,
      };

      return { profile, products };
    },
    enabled: !!username,
  });
}
