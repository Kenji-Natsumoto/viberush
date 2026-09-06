import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ADMIN_ID = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31';

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.id === ADMIN_ID;
}

/**
 * Admin transfers ownership of a proxy-submitted product to the real creator.
 * Sets owner_id to the product's user_id (for self-submitted) or a specified user.
 */
export function useTransferOwnership() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, newOwnerId }: { productId: string; newOwnerId: string }) => {
      const { error } = await supabase
        .from('products')
        .update({ owner_id: newOwnerId })
        .eq('id', productId);

      if (error) throw error;
      return { productId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      toast({ title: "Ownership transferred ✅", description: "The owner has been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Transfer failed", description: error.message, variant: "destructive" });
    },
  });
}

/**
 * Admin revokes ownership (resets owner_id to null).
 */
export function useRevokeOwnership() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .update({ owner_id: null })
        .eq('id', productId);

      if (error) throw error;
      return { productId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', result.productId] });
      toast({ title: "Ownership revoked", description: "The owner has been reset." });
    },
    onError: (error: Error) => {
      toast({ title: "Revoke failed", description: error.message, variant: "destructive" });
    },
  });
}
