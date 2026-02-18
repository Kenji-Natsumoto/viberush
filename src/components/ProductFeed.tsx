import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { Flame, Calendar, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { dummyProducts } from "@/data/dummyProducts";

type SortOption = "hottest" | "newest";

export function ProductFeed() {
  const [sortBy, setSortBy] = useState<SortOption>("hottest");
  const { products: dbProducts, isLoading, error } = useProducts();

  // Use database products if available, otherwise fall back to dummy data
  const products = dbProducts.length > 0 ? dbProducts : dummyProducts.map(p => ({
    ...p,
    userId: '',
    updatedAt: p.createdAt,
  }));

  // Get current week display
  const currentWeek = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const formatDate = (date: Date) => 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `${formatDate(startOfWeek)} – ${formatDate(endOfWeek)}`;
  }, []);

  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // hottest - weighted + time-decay (HN-style)
      const getHotnessScore = (vibeScore: number, votes: number, createdAt: string): number => {
        const hoursAgo = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
        const vibeWeight = 2;
        const votesWeight = 0.5;
        const gravity = 2;
        const decay = 1.2;
        return (vibeWeight * vibeScore + votesWeight * votes) / Math.pow(hoursAgo + gravity, decay);
      };
      return getHotnessScore(b.vibeScore, b.votes, b.createdAt) - getHotnessScore(a.vibeScore, a.votes, a.createdAt);
    });
    
    // Limit to Top 10
    return sorted.slice(0, 10);
  }, [products, sortBy]);

  const sortOptions: { key: SortOption; label: string; icon: React.ReactNode }[] = [
    { key: "hottest", label: "Hottest", icon: <Flame className="h-3.5 w-3.5" /> },
    { key: "newest", label: "New", icon: <Calendar className="h-3.5 w-3.5" /> },
  ];

  return (
    <section id="launches" className="max-w-3xl mx-auto px-4 pt-12 pb-16 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">This Week's Ranking</h2>
          <p className="text-sm text-muted-foreground">{currentWeek}</p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                sortBy === option.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load products. Using demo data.</p>
        </div>
      )}

      {/* Product List */}
      {!isLoading && (
        <div className="space-y-3">
          {sortedProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              rank={index + 1}
              creatorId={product.userId}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No apps shipped yet.</p>
          <p className="text-sm text-muted-foreground">Be the first to ship your proof 🚀</p>
        </div>
      )}

      {/* View All */}
      {!isLoading && sortedProducts.length > 0 && (
        <div className="flex justify-center mt-8">
          <Link to="/explore" className="relative rounded-lg p-[2px] border-glow-wrapper">
            <span className="relative z-10 flex items-center gap-2 rounded-[6px] bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
