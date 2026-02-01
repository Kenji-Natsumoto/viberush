import { ProductCard } from "./ProductCard";
import { dummyProducts } from "@/data/dummyProducts";
import { Calendar, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SortOption = "votes" | "newest" | "time";

export function ProductFeed() {
  const [sortBy, setSortBy] = useState<SortOption>("votes");

  const sortedProducts = [...dummyProducts].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const sortOptions: { key: SortOption; label: string; icon: React.ReactNode }[] = [
    { key: "votes", label: "Top", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { key: "newest", label: "New", icon: <Calendar className="h-3.5 w-3.5" /> },
    { key: "time", label: "Fastest", icon: <Clock className="h-3.5 w-3.5" /> },
  ];

  return (
    <section className="max-w-3xl mx-auto px-4 pb-16">
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

      {/* Product List */}
      <div className="space-y-3">
        {sortedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
