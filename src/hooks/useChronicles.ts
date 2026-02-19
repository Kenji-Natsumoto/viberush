import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ADMIN_UID = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31';

export interface Chronicle {
  id: string;
  date: string;
  title: string;
  category: string;
  content: string;
  illustration_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ChronicleInput = {
  date: string;
  title: string;
  category: string;
  content: string;
  illustration_url?: string | null;
};

const CHRONICLES_KEY = ['chronicles'];

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.id === ADMIN_UID;
}

export function useChronicles() {
  return useQuery({
    queryKey: CHRONICLES_KEY,
    queryFn: async (): Promise<Chronicle[]> => {
      const { data, error } = await supabase
        .from('chronicles')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Chronicle[];
    },
  });
}

export function useCreateChronicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: ChronicleInput) => {
      const { data, error } = await supabase
        .from('chronicles')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as Chronicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHRONICLES_KEY });
      toast({ title: 'Chronicle Published ✨', description: 'New entry added to the timeline.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateChronicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...input }: ChronicleInput & { id: string }) => {
      const { error } = await supabase
        .from('chronicles')
        .update(input)
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHRONICLES_KEY });
      toast({ title: 'Updated ✨', description: 'Chronicle entry updated.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteChronicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chronicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHRONICLES_KEY });
      toast({ title: 'Deleted', description: 'Chronicle entry removed.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    },
  });
}
