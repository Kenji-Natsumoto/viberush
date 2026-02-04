import { ProductCard } from "./ProductCard";
import { Calendar, TrendingUp, Clock, Loader2, Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { dummyProducts } from "@/data/dummyProducts";

type SortOption = "votes" | "newest" | "time" | "hottest";

export function ProductFeed() {
  const [sortBy, setSortBy] = useState<SortOption>("votes");
  const { products: dbProducts, isLoading, error } = useProducts();

  // Use database products if available, otherwise fall back to dummy data
  const products = dbProducts.length > 0 ? dbProducts : dummyProducts.map(p => ({
    ...p,
    userId: '',
    updatedAt: p.createdAt,
  }));

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "newest") {
      // Sort by created_at descending (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "time") {
      // Sort by time_to_build ascending (fastest first)
      // Parse time strings like "2 hours", "30 minutes", "1 day"
      const parseTime = (time: string): number => {
        const match = time.match(/(\d+)\s*(minute|hour|day|week)/i);
        if (!match) return Infinity;
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.startsWith('minute')) return value;
        if (unit.startsWith('hour')) return value * 60;
        if (unit.startsWith('day')) return value * 60 * 24;
        if (unit.startsWith('week')) return value * 60 * 24 * 7;
        return Infinity;
      };
      return parseTime(a.timeToBuild) - parseTime(b.timeToBuild);
    }
    if (sortBy === "hottest") {
      // Weighted + time-decay hotness (HN-style)
      // Formula: (vibeWeight * vibe + votesWeight * votes) / (hoursAgo + gravity)^decay
      const getHotnessScore = (vibeScore: number, votes: number, createdAt: string): number => {
        const hoursAgo = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
        const vibeWeight = 2;    // Vibe contributes more
        const votesWeight = 0.5; // Votes contribute less to differ from "Top"
        const gravity = 2;       // Base time offset
        const decay = 1.2;       // Decay exponent
        return (vibeWeight * vibeScore + votesWeight * votes) / Math.pow(hoursAgo + gravity, decay);
      };
      return getHotnessScore(b.vibeScore, b.votes, b.createdAt) - getHotnessScore(a.vibeScore, a.votes, a.createdAt);
    }
    return 0;
  });

  const sortOptions: { key: SortOption; label: string; icon: React.ReactNode }[] = [
    { key: "votes", label: "Top", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { key: "hottest", label: "Hottest", icon: <Flame className="h-3.5 w-3.5" /> },
    { key: "newest", label: "New", icon: <Calendar className="h-3.5 w-3.5" /> },
    { key: "time", label: "Fastest", icon: <Clock className="h-3.5 w-3.5" /> },
  ];

  return (
    <section id="launches" className="max-w-3xl mx-auto px-4 pb-16 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Today's Launches</h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
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

      {/* Vibe Score explanation */}
      <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
        <Flame className="h-4 w-4 text-orange-500 shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Vibe Score</span> — A measure of user excitement. Send 🔥 to apps you love!
        </p>
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
          <p className="text-muted-foreground mb-2">No apps submitted yet!</p>
          <p className="text-sm text-muted-foreground">Be the first to share your vibe-coded creation 🚀</p>
        </div>
      )}
    </section>
  );
}
