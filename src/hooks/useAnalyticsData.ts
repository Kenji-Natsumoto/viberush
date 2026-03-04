import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type Period = 'today' | 'week' | 'month';

export interface VibeClickRow {
  source: string | null;
  created_at: string;
  product_id: string;
}

export interface SourceSummary {
  twitter: number;
  linkedin: number;
  total: number;
}

export interface DailyBreakdown {
  date: string;
  twitter: number;
  linkedin: number;
  total: number;
}

export interface ProductBreakdown {
  product_id: string;
  twitter: number;
  linkedin: number;
  total: number;
}

function getStartDate(period: Period): Date {
  const now = new Date();
  if (period === 'today') {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === 'week') {
    const d = new Date(now);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // 月曜始まり
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  // month
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * 指定期間のSNS（X / LinkedIn）Vibeクリックを取得
 */
export function useVibeAnalytics(period: Period) {
  return useQuery({
    queryKey: ['vibe-analytics', period],
    queryFn: async () => {
      const startDate = getStartDate(period);

      const { data, error } = await supabase
        .from('vibe_clicks')
        .select('source, created_at, product_id')
        .in('source', ['twitter', 'linkedin'])
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VibeClickRow[];
    },
    refetchInterval: 5 * 60 * 1000, // 5分ごと自動更新
  });
}

/**
 * 直近7日間の日別データを取得（トレンドグラフ用）
 */
export function useDailyVibeAnalytics() {
  return useQuery({
    queryKey: ['vibe-analytics-daily'],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('vibe_clicks')
        .select('source, created_at, product_id')
        .in('source', ['twitter', 'linkedin'])
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as VibeClickRow[];
    },
    refetchInterval: 5 * 60 * 1000,
  });
}

// ── 集計ヘルパー ─────────────────────────────────────

/** ソース別 合計 */
export function aggregateSummary(clicks: VibeClickRow[]): SourceSummary {
  const twitter = clicks.filter((c) => c.source === 'twitter').length;
  const linkedin = clicks.filter((c) => c.source === 'linkedin').length;
  return { twitter, linkedin, total: twitter + linkedin };
}

/** 日別 内訳（新しい日順） */
export function aggregateByDate(clicks: VibeClickRow[]): DailyBreakdown[] {
  const map: Record<string, { twitter: number; linkedin: number }> = {};

  for (const click of clicks) {
    const date = click.created_at.slice(0, 10); // YYYY-MM-DD
    if (!map[date]) map[date] = { twitter: 0, linkedin: 0 };
    if (click.source === 'twitter') map[date].twitter++;
    if (click.source === 'linkedin') map[date].linkedin++;
  }

  return Object.entries(map)
    .map(([date, counts]) => ({
      date,
      ...counts,
      total: counts.twitter + counts.linkedin,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** プロダクト別 内訳（Vibe数上位10件） */
export function aggregateByProduct(clicks: VibeClickRow[]): ProductBreakdown[] {
  const map: Record<string, { twitter: number; linkedin: number }> = {};

  for (const click of clicks) {
    const pid = click.product_id;
    if (!map[pid]) map[pid] = { twitter: 0, linkedin: 0 };
    if (click.source === 'twitter') map[pid].twitter++;
    if (click.source === 'linkedin') map[pid].linkedin++;
  }

  return Object.entries(map)
    .map(([product_id, counts]) => ({
      product_id,
      ...counts,
      total: counts.twitter + counts.linkedin,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}
