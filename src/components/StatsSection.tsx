import { useProducts } from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useMemo } from "react";

export function StatsSection() {
  const { products } = useProducts();

  // Total SHIP count including removed products (for integrity)
  const { data: totalShipCount } = useQuery({
    queryKey: ['total-ship-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Use total count from DB (includes removed) for SHIP integrity
    const seededCount = totalShipCount ?? products.length;
    
    // Count featured makers (unique user IDs from featured products)
    const featuredMakers = new Set(
      products
        .filter(p => p.isFeatured)
        .map(p => p.userId || p.proxyCreatorName)
    ).size;
    
    // Count new this week
    const newThisWeek = products.filter(p => 
      new Date(p.createdAt) >= oneWeekAgo
    ).length;
    
    return {
      seeded: seededCount,
      featured: featuredMakers || 3, // Minimum 3 for display
      newThisWeek: newThisWeek,
    };
  }, [products, totalShipCount]);

  return (
    <section className="py-8 border-y border-border bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center gap-12 md:gap-16">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {stats.seeded}
            </p>
            <p className="text-sm text-muted-foreground">
              Seeded Stats (beta)
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {stats.featured}
            </p>
            <p className="text-sm text-muted-foreground">
              Featured Makers
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {stats.newThisWeek}
            </p>
            <p className="text-sm text-muted-foreground">
              New This Week
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
