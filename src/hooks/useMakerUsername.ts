import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Look up the maker_profiles username for a given user ID.
 * Returns the username string or undefined if no profile exists.
 */
export function useMakerUsername(userId: string | undefined) {
  return useQuery({
    queryKey: ['maker-username', userId],
    queryFn: async (): Promise<string | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('maker_profiles')
        .select('username')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data?.username ?? null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });
}
