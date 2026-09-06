import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Release updates (MS-VR-7 phase 1).
 *
 * One row = one update on one product's timeline. Who may write is decided by
 * the ownership model that already exists on `products` (user_id / owner_id),
 * enforced in RLS — deliberately NOT by a hardcoded admin UID the way
 * useChronicles does. See docs/requirements/MS-VR-7_release-updates-phase1-v1.0.md §3.
 */
export interface ProductUpdate {
  id: string;
  product_id: string;
  author_id: string;
  date: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export const UPDATE_TITLE_MAX = 80;
export const UPDATE_BODY_MAX = 2000;

const key = (productId: string) => ['product-updates', productId];

export function useProductUpdates(productId: string | undefined) {
  return useQuery({
    queryKey: key(productId ?? ''),
    enabled: !!productId,
    queryFn: async (): Promise<ProductUpdate[]> => {
      const { data, error } = await supabase
        .from('product_updates')
        .select('*')
        .eq('product_id', productId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ProductUpdate[];
    },
  });
}

export function useCreateProductUpdate(productId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ title, body, authorId }: { title: string; body: string; authorId: string }) => {
      const { data, error } = await supabase
        .from('product_updates')
        .insert({ product_id: productId, author_id: authorId, title, body })
        .select()
        .single();
      if (error) throw error;
      return data as ProductUpdate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(productId) });
      toast({ title: 'Update posted ✨', description: 'It is now on your product page.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not post', description: error.message, variant: 'destructive' });
    },
  });
}

export function useEditProductUpdate(productId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, title, body }: { id: string; title: string; body: string }) => {
      const { error } = await supabase
        .from('product_updates')
        .update({ title, body, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(productId) });
      toast({ title: 'Update saved', description: 'Your change is live.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
    },
  });
}
