import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useImageUpload } from './useImageUpload';

export interface ProductScreenshot {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export function useProductScreenshots(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-screenshots', productId],
    queryFn: async (): Promise<ProductScreenshot[]> => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from('product_screenshots')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!productId,
  });
}

export function useAddScreenshots() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { upload } = useImageUpload();

  return useMutation({
    mutationFn: async ({ productId, files }: { productId: string; files: File[] }) => {
      if (!user) throw new Error('Must be logged in');

      const urls: string[] = [];
      // Upload all files in parallel
      const results = await Promise.all(files.map((f) => upload(f)));
      for (const url of results) {
        if (url) urls.push(url);
      }

      if (urls.length === 0) throw new Error('No files uploaded successfully');

      // Get current max sort_order
      const { data: existing } = await supabase
        .from('product_screenshots')
        .select('sort_order')
        .eq('product_id', productId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const startOrder = (existing?.[0]?.sort_order ?? -1) + 1;

      const rows = urls.map((url, i) => ({
        product_id: productId,
        url,
        sort_order: startOrder + i,
      }));

      const { error } = await supabase.from('product_screenshots').insert(rows);
      if (error) throw error;

      return rows;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-screenshots', variables.productId] });
      toast.success('Screenshots uploaded!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Upload failed');
    },
  });
}

export function useDeleteScreenshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productId }: { id: string; productId: string }) => {
      const { error } = await supabase
        .from('product_screenshots')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { productId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-screenshots', data.productId] });
      toast.success('Screenshot deleted');
    },
    onError: () => {
      toast.error('Delete failed');
    },
  });
}
