import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

function generateCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/** Fetch the existing short URL for a product (if any) */
export function useShortUrl(productId: string | undefined) {
  return useQuery({
    queryKey: ['short-url', productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data, error } = await supabase
        .from('short_urls')
        .select('code')
        .eq('product_id', productId)
        .maybeSingle();
      if (error) throw error;
      return data?.code ?? null;
    },
    enabled: !!productId,
  });
}

/** Create a short URL for a product */
export function useCreateShortUrl() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      // Check if one already exists
      const { data: existing } = await supabase
        .from('short_urls')
        .select('code')
        .eq('product_id', productId)
        .maybeSingle();

      if (existing?.code) return existing.code as string;

      // Try up to 3 times in case of code collision
      for (let attempt = 0; attempt < 3; attempt++) {
        const code = generateCode();
        const { data, error } = await supabase
          .from('short_urls')
          .insert({ code, product_id: productId })
          .select('code')
          .single();

        if (!error && data) return data.code as string;
        // If unique violation, retry with new code
        if (error && error.code === '23505') continue;
        if (error) throw error;
      }
      throw new Error('Failed to generate unique short code');
    },
    onSuccess: (code, productId) => {
      queryClient.setQueryData(['short-url', productId], code);
      const shortUrl = `${window.location.origin}/s/${code}`;
      navigator.clipboard.writeText(shortUrl);
      toast({
        title: 'Short URL Copied! 🔗',
        description: shortUrl,
      });
    },
    onError: (error: Error) => {
      console.error('Short URL error:', error);
      toast({
        title: 'Failed to create short URL',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
