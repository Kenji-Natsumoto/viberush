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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as DbProduct[]).map(dbProductToProduct);
    },
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
      return dbProductToProduct(data as DbProduct);
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
          tagline: input.tagline,
          description: input.description,
          url: input.url,
          icon_url: input.iconUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${input.name}&backgroundColor=6366f1`,
          banner_url: input.bannerUrl || null,
          demo_url: input.demoUrl || null,
          video_url: input.videoUrl || null,
          ai_prompt: input.aiPrompt || null,
          tools_used: input.tools,
          time_to_build: input.timeToBuild,
          user_id: user.id,
          contact_email: input.contactEmail,
          x_url: input.xUrl || null,
          linkedin_url: input.linkedinUrl || null,
          github_url: input.githubUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      return dbProductToProduct(data as DbProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast({
        title: "App Submitted! 🎉",
        description: "Your app is now live on VibeRush!",
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

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateProductInput & { id: string }) => {
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
      if (input.timeToBuild !== undefined) updateData.time_to_build = input.timeToBuild;
      if (input.contactEmail !== undefined) updateData.contact_email = input.contactEmail;
      if (input.xUrl !== undefined) updateData.x_url = input.xUrl || null;
      if (input.linkedinUrl !== undefined) updateData.linkedin_url = input.linkedinUrl || null;
      if (input.githubUrl !== undefined) updateData.github_url = input.githubUrl || null;

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Product not found or you do not have permission to edit it');
      return dbProductToProduct(data as DbProduct);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
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
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        // Add vote
        const { error } = await supabase
          .from('votes')
          .insert({ product_id: productId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['user-votes'] });
    },
    onError: (error: Error) => {
      console.error('Vote error:', error);
      toast({
        title: "Vote Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
