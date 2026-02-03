import { ProductCard } from "./ProductCard";
import { Calendar, TrendingUp, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { dummyProducts } from "@/data/dummyProducts";

type SortOption = "votes" | "newest" | "time";

export function ProductFeed() {
  const [sortBy, setSortBy] = useState<SortOption>("votes");
  const { products: dbProducts, isLoading, error } = useProducts();

  // Use database products if available, otherwise fall back to dummy data
  const products = dbProducts.length > 0 ? dbProducts : dummyProducts.map(p => ({
    ...p,
    userId: '',
    updatedAt: p.createdAt,
  }));

  // Custom sort orders for demo
  const newOrder = ['LaunchKit', 'CodeBuddy', 'VoiceNote', 'VibeRush'];
  const fastestOrder = ['VibeRush', 'VoiceNote', 'LaunchKit', 'CodeBuddy'];

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "newest") {
      const aIndex = newOrder.indexOf(a.name);
      const bIndex = newOrder.indexOf(b.name);
      // If not in list, put at the end
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    }
    if (sortBy === "time") {
      const aIndex = fastestOrder.indexOf(a.name);
      const bIndex = fastestOrder.indexOf(b.name);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    }
    return 0;
  });

  const sortOptions: { key: SortOption; label: string; icon: React.ReactNode }[] = [
    { key: "votes", label: "Top", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { key: "newest", label: "New", icon: <Calendar className="h-3.5 w-3.5" /> },
    { key: "time", label: "Fastest", icon: <Clock className="h-3.5 w-3.5" /> },
  ];

  return (
    <section id="launches" className="max-w-3xl mx-auto px-4 pb-16 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
