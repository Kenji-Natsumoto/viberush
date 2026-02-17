import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ADMIN_ID = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31';

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.id === ADMIN_ID;
}

export function useRequestClaim() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('ログインが必要です');

      // Use admin-only update won't work here since user isn't admin.
      // Instead we need a separate mechanism. For now, we'll use a claims table approach
      // or allow user to set claim_status to 'pending' via a permissive policy.
      // Since the current RLS only allows admin or verified owner to UPDATE,
      // we need to use a Supabase RPC or relax the policy.
      // For simplicity, let's call an RPC function.
      
      // Fallback: direct update with owner_id set
      const { error, count } = await supabase
        .from('products')
        .update({ 
          claim_status: 'pending',
          owner_id: user.id 
        }, { count: 'exact' })
        .eq('id', productId)
        .is('owner_id', null); // Only claim if no owner yet

      if (error) throw error;
      if (typeof count === 'number' && count === 0) {
        throw new Error('このアプリは既に所有権が設定されています');
      }

      return { productId };
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast({
        title: "申請を送信しました 📩",
        description: "管理者が確認後、所有権が承認されます。",
      });
    },
    onError: (error: Error) => {
      console.error('Claim error:', error);
      toast({
        title: "申請に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useApproveClaim() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .update({ claim_status: 'verified' })
        .eq('id', productId);

      if (error) throw error;
      return { productId };
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast({ title: "承認しました ✅", description: "所有権が確認されました。" });
    },
    onError: (error: Error) => {
      toast({ title: "承認に失敗", description: error.message, variant: "destructive" });
    },
  });
}

export function useRejectClaim() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .update({ claim_status: 'none', owner_id: null })
        .eq('id', productId);

      if (error) throw error;
      return { productId };
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast({ title: "却下しました", description: "申請が却下されました。" });
    },
    onError: (error: Error) => {
      toast({ title: "却下に失敗", description: error.message, variant: "destructive" });
    },
  });
}
