import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface ProductCuration {
  id: string;
  product_id: string;
  content_md: string;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MakerRespect {
  id: string;
  maker_id: string;
  content_md: string;
  created_at: string;
  updated_at: string;
}

// ── Product Curation ──────────────────────────

export function useProductCuration(productId?: string) {
  return useQuery({
    queryKey: ['product_curation', productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_curations')
        .select('*')
        .eq('product_id', productId!)
        .maybeSingle();
      if (error) throw error;
      return data as ProductCuration | null;
    },
  });
}

export function useAllProductCurations() {
  return useQuery({
    queryKey: ['all_product_curations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_curations')
        .select('*, products(id, name)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as (ProductCuration & { products: { id: string; name: string } })[];
    },
  });
}

export function useUpsertProductCuration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { product_id: string; content_md: string; video_url?: string }) => {
      const { data, error } = await supabase
        .from('product_curations')
        .upsert({ ...payload, updated_at: new Date().toISOString() }, { onConflict: 'product_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['product_curation', vars.product_id] });
      qc.invalidateQueries({ queryKey: ['all_product_curations'] });
    },
  });
}

export function useDeleteProductCuration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_curations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product_curation'] });
      qc.invalidateQueries({ queryKey: ['all_product_curations'] });
    },
  });
}

// ── Maker Respect ─────────────────────────────

export function useMakerRespect(makerId?: string) {
  return useQuery({
    queryKey: ['maker_respect', makerId],
    enabled: !!makerId && !makerId.startsWith('virtual-'),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maker_respects')
        .select('*')
        .eq('maker_id', makerId!)
        .maybeSingle();
      if (error) throw error;
      return data as MakerRespect | null;
    },
  });
}

export function useAllMakerRespects() {
  return useQuery({
    queryKey: ['all_maker_respects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maker_respects')
        .select('*, maker_profiles(id, username, display_name)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as (MakerRespect & {
        maker_profiles: { id: string; username: string; display_name: string | null };
      })[];
    },
  });
}

export function useAllMakerProfilesSimple() {
  return useQuery({
    queryKey: ['maker_profiles_simple'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maker_profiles')
        .select('id, username, display_name')
        .order('username');
      if (error) throw error;
      return data as { id: string; username: string; display_name: string | null }[];
    },
  });
}

export function useUpsertMakerRespect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { maker_id: string; content_md: string }) => {
      const { data, error } = await supabase
        .from('maker_respects')
        .upsert({ ...payload, updated_at: new Date().toISOString() }, { onConflict: 'maker_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['maker_respect', vars.maker_id] });
      qc.invalidateQueries({ queryKey: ['all_maker_respects'] });
    },
  });
}

export function useDeleteMakerRespect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('maker_respects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['maker_respect'] });
      qc.invalidateQueries({ queryKey: ['all_maker_respects'] });
    },
  });
}
