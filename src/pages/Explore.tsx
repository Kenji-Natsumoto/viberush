import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown, Crown, Clock, Filter } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolBadge } from "@/components/ToolBadge";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES } from "@/lib/categoryConfig";
import type { Product } from "@/types/database";

type SortOption = "newest" | "alphabetical";

const CATEGORY_OPTIONS = ["All", ...PRODUCT_CATEGORIES];

export default function Explore() {
  const { products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter (uses DB category field)
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    // Sort
    if (sort === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSubmitClick={() => {}} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            The Backstage Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every product shipped on VibeRush. Search, filter, discover.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-transparent focus:border-border"
            />
          </div>

          {/* Category Filter - Scrollable Chips */}
          <div className="flex-1 overflow-x-auto scrollbar-hide pb-1 -mb-1">
            <div className="flex gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border",
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary text-muted-foreground border-transparent hover:border-border"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-transparent">
              <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="h-10 w-10 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-1">
              No products found
            </h2>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ExploreCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ExploreCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative border border-border rounded-xl p-4 hover:shadow-card-hover transition-all duration-200 bg-card block"
    >
      {/* Hall of Proof Crown */}
      {product.isFeatured && (
        <div className="absolute -top-2.5 -right-2.5 z-10">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-lg shadow-amber-500/30 ring-2 ring-background">
            <Crown className="h-4 w-4 text-white drop-shadow-sm" />
          </div>
        </div>
      )}

      {/* Featured glow border */}
      {product.isFeatured && (
        <div className="absolute inset-0 rounded-xl ring-1 ring-amber-400/40 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={product.iconUrl}
          alt={product.name}
          className="h-10 w-10 rounded-[6px] object-cover bg-muted shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground truncate group-hover:underline underline-offset-2">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
        {product.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap min-w-0">
          {product.tools.slice(0, 2).map((tool) => (
            <ToolBadge key={tool} tool={tool} />
          ))}
          {product.tools.length > 2 && (
            <Badge variant="secondary" className="text-[10px]">
              +{product.tools.length - 2}
            </Badge>
          )}
        </div>
        {product.timeToBuild && (
          <Badge
            variant="secondary"
            className="text-[10px] shrink-0 gap-1 bg-background border border-border"
          >
            <Clock className="h-3 w-3" />
            {product.timeToBuild}
          </Badge>
        )}
      </div>
    </Link>
  );
}
