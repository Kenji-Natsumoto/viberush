import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DbProduct, 
  Product, 
  CreateProductInput, 
  UpdateProductInput,
  dbProductToProduct 
} from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { getProductIconUrl } from '@/lib/iconUtils';

const PRODUCTS_KEY = ['products'];

export function useProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all products
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async (): Promise<Product[]> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal);

        if (error) throw error;
        return (data as DbProduct[]).map((p) => dbProductToProduct(p));
      } finally {
        clearTimeout(timeout);
      }
    },
    networkMode: 'always',
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Realtime update:', payload);
          // Refetch to get the latest data
          queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { products, isLoading, error, refetch };
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<Product | null> => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const dbProduct = data as DbProduct;
      let fallbackAvatar: string | undefined;

      // If proxy_avatar_url is missing, try to find an avatar from:
      // 1. maker_profiles (if owner_id or user_id has a profile)
      // 2. Another product by the same proxy_creator_name that has an avatar
      if (!dbProduct.proxy_avatar_url) {
        const profileUserId = dbProduct.owner_id || dbProduct.user_id;
        const { data: profile } = await supabase
          .from('maker_profiles')
          .select('avatar_url')
          .eq('id', profileUserId)
          .maybeSingle();

        if (profile?.avatar_url) {
          fallbackAvatar = profile.avatar_url;
        } else if (dbProduct.proxy_creator_name) {
          // Look for avatar from sibling products by same creator
          const { data: sibling } = await supabase
            .from('products')
            .select('proxy_avatar_url')
            .ilike('proxy_creator_name', dbProduct.proxy_creator_name)
            .not('proxy_avatar_url', 'is', null)
            .limit(1)
            .maybeSingle();

          if (sibling?.proxy_avatar_url) {
            fallbackAvatar = sibling.proxy_avatar_url;
          }
        }
      }

      return dbProductToProduct(dbProduct, fallbackAvatar);
    },
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      if (!user) throw new Error('Must be logged in to create a product');

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: input.name,
          description: input.description,
          proxy_creator_name: input.proxyCreatorName,
          user_id: user.id,
          // Optional fields - only set if provided
          tagline: input.tagline || '',
          url: input.url || '',
          icon_url: input.iconUrl || getProductIconUrl(input.name),
          banner_url: input.bannerUrl || '',
          demo_url: input.demoUrl || '',
          video_url: input.videoUrl || '',
          ai_prompt: input.aiPrompt || '',
          tools_used: input.tools || [],
          time_to_build: input.timeToBuild || '1 hour',
          contact_email: input.contactEmail || '',
          x_url: input.xUrl || '',
          linkedin_url: input.linkedinUrl || '',
          github_url: input.githubUrl || '',
          proxy_avatar_url: input.proxyAvatarUrl || '',
        })
        .select()
        .single();

      if (error) throw error;
      return dbProductToProduct(data as DbProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast({
        title: "Shipped! 🎉",
        description: "Your proof is now live on VibeRush!",
      });
    },
    onError: (error: Error) => {
      console.error('Create product error:', error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateProductInput & { id: string }) => {
      if (!user) throw new Error('Must be logged in to edit a product');

      const updateData: Record<string, unknown> = {};
      
      if (input.name !== undefined) updateData.name = input.name;
      if (input.tagline !== undefined) updateData.tagline = input.tagline;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.url !== undefined) updateData.url = input.url;
      if (input.iconUrl !== undefined) updateData.icon_url = input.iconUrl;
      if (input.bannerUrl !== undefined) updateData.banner_url = input.bannerUrl || null;
      if (input.demoUrl !== undefined) updateData.demo_url = input.demoUrl || null;
      if (input.videoUrl !== undefined) updateData.video_url = input.videoUrl || null;
      if (input.aiPrompt !== undefined) updateData.ai_prompt = input.aiPrompt || null;
      if (input.tools !== undefined) updateData.tools_used = input.tools;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.timeToBuild !== undefined) updateData.time_to_build = input.timeToBuild;
      if (input.contactEmail !== undefined) updateData.contact_email = input.contactEmail;
      if (input.xUrl !== undefined) updateData.x_url = input.xUrl || null;
      if (input.linkedinUrl !== undefined) updateData.linkedin_url = input.linkedinUrl || null;
      if (input.githubUrl !== undefined) updateData.github_url = input.githubUrl || null;
      if (input.proxyCreatorName !== undefined) updateData.proxy_creator_name = input.proxyCreatorName || null;
      if (input.proxyAvatarUrl !== undefined) updateData.proxy_avatar_url = input.proxyAvatarUrl || null;

      // Try update as original submitter (user_id) first
      const { error, count } = await supabase
        .from('products')
        .update(updateData, { count: 'exact' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // If 0 rows updated, try as verified owner (owner_id)
      if (typeof count === 'number' && count === 0) {
        const { error: ownerError, count: ownerCount } = await supabase
          .from('products')
          .update(updateData, { count: 'exact' })
          .eq('id', id)
          .eq('owner_id', user.id);

        if (ownerError) throw ownerError;

        if (typeof ownerCount === 'number' && ownerCount === 0) {
          // Check why it failed
          const { data: ownerRow, error: ownerErr } = await supabase
            .from('products')
            .select('user_id, owner_id, claim_status')
            .eq('id', id)
            .maybeSingle();

          if (ownerErr) throw ownerErr;
          if (!ownerRow) throw new Error('Product not found');

          console.log('[VibeRush Debug] Update failed:', { userId: user.id, product: ownerRow });

          if (ownerRow.user_id !== user.id && ownerRow.owner_id !== user.id) {
            throw new Error("You're logged in with a different account than the owner of this app.");
          }

          throw new Error(
            'Your Supabase RLS policy is blocking UPDATE on products. Please ensure an UPDATE policy allows owner_id or user_id match.'
          );
        }
      }

      return { id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      toast({
        title: "Changes Saved! ✨",
        description: "Your app has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Update product error:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUserVotes() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-votes', user?.id],
    queryFn: async (): Promise<Set<string>> => {
      if (!user) return new Set();

      const { data, error } = await supabase
        .from('votes')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return new Set((data || []).map((v) => v.product_id));
    },
    enabled: !!user,
  });
}

export function useToggleVote() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, hasVoted }: { productId: string; hasVoted: boolean }) => {
      if (!user) throw new Error('Must be logged in to vote');

      if (hasVoted) {
        // Remove vote
        const { error, count } = await supabase
          .from('votes')
          .delete({ count: 'exact' })
          .eq('product_id', productId)
          .eq('user_id', user.id);
        if (error) throw error;

        // With RLS, PostgREST may return 204 even when 0 rows were affected.
        // If count is 0, the row still exists but DELETE is blocked (missing/incorrect RLS policy).
        if (typeof count === 'number' && count === 0) {
          throw new Error(
            "Couldn't remove your vote. Supabase RLS may be blocking DELETE on the votes table (expected policy: FOR DELETE USING (auth.uid() = user_id))."
          );
        }
      } else {
        // Add vote
        const { error } = await supabase
          .from('votes')
          .insert({ product_id: productId, user_id: user.id });
        if (error) throw error;
      }
      
      return { productId, hasVoted };
    },
    onMutate: async ({ productId, hasVoted }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      await queryClient.cancelQueries({ queryKey: ['user-votes', user?.id] });

      // Snapshot previous values
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_KEY);
      const previousUserVotes = queryClient.getQueryData<Set<string>>(['user-votes', user?.id]);

      // Optimistically update products
      queryClient.setQueryData<Product[]>(PRODUCTS_KEY, (old) => {
        if (!old) return old;
        return old.map((product) =>
          product.id === productId
            ? { ...product, votes: product.votes + (hasVoted ? -1 : 1) }
            : product
        );
      });

      // Optimistically update user votes
      queryClient.setQueryData<Set<string>>(['user-votes', user?.id], (old) => {
        const newSet = new Set(old);
        if (hasVoted) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });

      return { previousProducts, previousUserVotes };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_KEY, context.previousProducts);
      }
      if (context?.previousUserVotes) {
        queryClient.setQueryData(['user-votes', user?.id], context.previousUserVotes);
      }
      console.error('Vote error:', error);
      toast({
        title: "Vote Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: (data) => {
      // Refetch to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['user-votes'] });
      // Also invalidate the single product query for detail pages
      if (data?.productId) {
        queryClient.invalidateQueries({ queryKey: ['product', data.productId] });
      }
    },
  });
}

// ============ Vibe Score Hooks ============

export function useUserVibeClicks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-vibe-clicks', user?.id],
    queryFn: async (): Promise<Set<string>> => {
      if (!user) return new Set();

      const { data, error } = await supabase
        .from('vibe_clicks')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return new Set((data || []).map((v) => v.product_id));
    },
    enabled: !!user,
  });
}

export function useToggleVibeClick() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, hasClicked }: { productId: string; hasClicked: boolean }) => {
      if (!user) throw new Error('Must be logged in to vibe');

      if (hasClicked) {
        // Remove vibe click
        const { error, count } = await supabase
          .from('vibe_clicks')
          .delete({ count: 'exact' })
          .eq('product_id', productId)
          .eq('user_id', user.id);
        if (error) throw error;

        if (typeof count === 'number' && count === 0) {
          throw new Error(
            "Couldn't remove your vibe. Supabase RLS may be blocking DELETE on the vibe_clicks table."
          );
        }
      } else {
        // Add vibe click
        const { error } = await supabase
          .from('vibe_clicks')
          .insert({ product_id: productId, user_id: user.id });
        if (error) throw error;
      }
      
      return { productId, hasClicked };
    },
    onMutate: async ({ productId, hasClicked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      await queryClient.cancelQueries({ queryKey: ['user-vibe-clicks', user?.id] });

      // Snapshot previous values
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_KEY);
      const previousUserVibeClicks = queryClient.getQueryData<Set<string>>(['user-vibe-clicks', user?.id]);

      // Optimistically update products
      queryClient.setQueryData<Product[]>(PRODUCTS_KEY, (old) => {
        if (!old) return old;
        return old.map((product) =>
          product.id === productId
            ? { ...product, vibeScore: product.vibeScore + (hasClicked ? -1 : 1) }
            : product
        );
      });

      // Optimistically update single product query
      queryClient.setQueryData<Product | null>(['product', productId], (old) => {
        if (!old) return old;
        return { ...old, vibeScore: old.vibeScore + (hasClicked ? -1 : 1) };
      });

      // Optimistically update user vibe clicks
      queryClient.setQueryData<Set<string>>(['user-vibe-clicks', user?.id], (old) => {
        const newSet = new Set(old);
        if (hasClicked) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });

      return { previousProducts, previousUserVibeClicks };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_KEY, context.previousProducts);
      }
      if (context?.previousUserVibeClicks) {
        queryClient.setQueryData(['user-vibe-clicks', user?.id], context.previousUserVibeClicks);
      }
      console.error('Vibe click error:', error);
      toast({
        title: "Vibe Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: (data) => {
      // Refetch to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['user-vibe-clicks'] });
      if (data?.productId) {
        queryClient.invalidateQueries({ queryKey: ['product', data.productId] });
      }
    },
  });
}
