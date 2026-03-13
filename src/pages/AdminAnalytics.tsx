import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  RefreshCw,
  Clock,
  TrendingUp,
  Zap,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { useIsAdmin } from "@/hooks/useChronicles";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import {
  useVibeAnalytics,
  useDailyVibeAnalytics,
  useAllVibeClicks,
  useAllDailyVibeClicks,
  aggregateSummary,
  aggregateByDate,
  aggregateByProduct,
  type Period,
} from "@/hooks/useAnalyticsData";

// プロダクト名を一括取得
function useProductNames(productIds: string[]) {
  return useQuery({
    queryKey: ["product-names-analytics", productIds.sort().join(",")],
    queryFn: async () => {
      if (productIds.length === 0) return {} as Record<string, string>;
      const { data, error } = await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds);
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const p of data) map[p.id] = p.name;
      return map;
    },
    enabled: productIds.length > 0,
  });
}

// 日付フォーマット（YYYY-MM-DD → M/D（曜））
function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
}

// ── サマリーカード ──────────────────────────────────
function SummaryCard({
  label,
  value,
  isLoading,
  color,
  highlight,
}: {
  label: string;
  value: number;
  isLoading: boolean;
  color: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`border ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border"
      }`}
    >
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground mb-3">{label}</p>
        {isLoading ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <p className={`text-4xl font-bold tabular-nums ${color}`}>
            {value.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ── メインページ ──────────────────────────────────
export default function AdminAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const [period, setPeriod] = useState<Period>("week");

  const {
    data: clicks = [],
    isLoading,
    dataUpdatedAt,
    refetch,
    isFetching,
  } = useVibeAnalytics(period);

  const { data: dailyClicks = [] } = useDailyVibeAnalytics();
  const { data: allClicks = [], isLoading: allLoading } = useAllVibeClicks(period);
  const { data: allDailyClicks = [] } = useAllDailyVibeClicks();

  const summary = aggregateSummary(clicks);
  const allTotal = allClicks.length;
  const organicTotal = allTotal - summary.total;
  const daily = aggregateByDate(dailyClicks, allDailyClicks);
  const topProducts = aggregateByProduct(clicks);

  const { data: productNames = {} } = useProductNames(
    topProducts.map((p) => p.product_id)
  );

  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const periodLabel =
    period === "today" ? "今日" : period === "week" ? "今週" : "今月";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSubmitClick={() => {}} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
          <span className="mx-1">/</span>
          <BarChart2 className="h-3.5 w-3.5" />
          SNS Analytics
        </Link>

        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
              <BarChart2 className="h-6 w-6" />
              SNS Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              X・LinkedIn からの流入 Vibe 行動を計測（Phase 1: Vibe数ベース）
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lastUpdated}
            </span>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors disabled:opacity-40"
            >
              <RefreshCw
                className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`}
              />
              更新
            </button>
          </div>
        </div>

        {/* Period Tabs */}
        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as Period)}
          className="mb-8"
        >
          <TabsList className="bg-muted">
            <TabsTrigger value="today">今日</TabsTrigger>
            <TabsTrigger value="week">今週</TabsTrigger>
            <TabsTrigger value="month">今月</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* ── Summary Cards ── */}
        {/* 行1: 全体Vibe集計 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <SummaryCard
            label="🔥 Total Vibes（全ソース）"
            value={allTotal}
            isLoading={allLoading}
            color="text-orange-400"
            highlight
          />
          <SummaryCard
            label="🌱 Organic Vibes（SNS非経由）"
            value={organicTotal < 0 ? 0 : organicTotal}
            isLoading={allLoading}
            color="text-emerald-400"
          />
        </div>
        {/* 行2: SNS流入内訳 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <SummaryCard
            label="🐦 X (Twitter) Vibes"
            value={summary.twitter}
            isLoading={isLoading}
            color="text-sky-400"
          />
          <SummaryCard
            label="💼 LinkedIn Vibes"
            value={summary.linkedin}
            isLoading={isLoading}
            color="text-blue-400"
          />
          <SummaryCard
            label="⚡ Total SNS Vibes"
            value={summary.total}
            isLoading={isLoading}
            color="text-primary"
          />
        </div>

        {/* ── 直近7日 トレンドテーブル ── */}
        <Card className="border border-border mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              直近7日間 日別 Vibe 数
            </CardTitle>
          </CardHeader>
          <CardContent>
            {daily.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                SNS流入からの Vibe データがまだありません
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2.5 pr-6 font-medium">日付</th>
                      <th className="pb-2.5 pr-6 font-medium text-sky-400">
                        🐦 X
                      </th>
                      <th className="pb-2.5 pr-6 font-medium text-blue-400">
                        💼 LinkedIn
                      </th>
                      <th className="pb-2.5 pr-6 font-medium">SNS合計</th>
                      <th className="pb-2.5 font-medium text-orange-400">
                        🔥 全件
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {daily.map((row) => (
                      <tr
                        key={row.date}
                        className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 pr-6 text-muted-foreground font-mono text-xs">
                          {formatDate(row.date)}
                        </td>
                        <td className="py-3 pr-6">
                          {row.twitter > 0 ? (
                            <span className="font-semibold text-sky-400">
                              {row.twitter}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-6">
                          {row.linkedin > 0 ? (
                            <span className="font-semibold text-blue-400">
                              {row.linkedin}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-6">
                          <span className="font-bold text-foreground">
                            {row.total}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-orange-400">
                            {row.allTotal}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Top Products ── */}
        <Card className="border border-border mb-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              SNS流入 Vibe TOP プロダクト
              <Badge variant="outline" className="text-xs ml-1 font-normal">
                {periodLabel}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                {periodLabel}の SNS流入 Vibe データがまだありません
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2.5 pr-3 font-medium w-8">#</th>
                      <th className="pb-2.5 pr-4 font-medium">プロダクト</th>
                      <th className="pb-2.5 pr-4 font-medium text-sky-400">
                        🐦 X
                      </th>
                      <th className="pb-2.5 pr-4 font-medium text-blue-400">
                        💼 LinkedIn
                      </th>
                      <th className="pb-2.5 font-medium">合計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((row, i) => (
                      <tr
                        key={row.product_id}
                        className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 pr-3 text-muted-foreground text-xs tabular-nums">
                          {i + 1}
                        </td>
                        <td className="py-3 pr-4 max-w-[220px]">
                          <Link
                            to={`/product/${row.product_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline underline-offset-2 truncate block"
                          >
                            {productNames[row.product_id] ||
                              row.product_id.slice(0, 8) + "…"}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">
                          {row.twitter > 0 ? (
                            <span className="font-semibold text-sky-400">
                              {row.twitter}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {row.linkedin > 0 ? (
                            <span className="font-semibold text-blue-400">
                              {row.linkedin}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-foreground">
                            {row.total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Phase 2 Placeholder ── */}
        <Card className="border border-dashed border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              🚧 Phase 2: GA4 流入データ
              <Badge variant="secondary" className="text-xs font-normal">
                準備中
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              GA4 Data API 連携後に追加表示されるデータ：
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>
                SNS 流入セッション数（
                <code className="font-mono text-[11px]">/explore</code>{" "}
                着地数）
              </li>
              <li>X vs LinkedIn 着地数比較・前週比</li>
              <li>
                着地 → 商品詳細遷移 → Vibe の完全ファネル
              </li>
              <li>
                キャンペーン別パフォーマンス（
                <code className="font-mono text-[11px]">wed_0304</code> 等）
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/40">
              GA4 Property ID:{" "}
              <code className="font-mono text-[11px] bg-muted px-1 py-0.5 rounded">
                522543299
              </code>{" "}
              — Google Cloud サービスアカウント + Supabase Edge Function 連携が必要
            </p>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-10">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard に戻る
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
