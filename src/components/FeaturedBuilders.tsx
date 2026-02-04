import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback featured builder names (used when no DB featured flag is set)
const FALLBACK_FEATURED_NAMES = [
  "Ruth Aju",
  "friezenberg", 
  "I AM PATFROG",
];

interface FeaturedBuilder {
  name: string;
  avatarUrl: string;
  productId: string;
  productName: string;
}

export function FeaturedBuilders() {
  const { products, isLoading } = useProducts();

  // Extract featured builders - prioritize is_featured from DB, fallback to static names
  const featuredBuilders: FeaturedBuilder[] = (() => {
    // First check for products marked as featured in DB
    const dbFeatured = products
      .filter((p) => p.isFeatured)
      .map((product) => ({
        name: product.creatorName || 'Vibe Coder',
        avatarUrl: product.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.userId}`,
        productId: product.id,
        productName: product.name,
      }));

    // If we have DB featured products, use those
    if (dbFeatured.length > 0) {
      return dbFeatured;
    }

    // Fallback to static list
    return FALLBACK_FEATURED_NAMES
      .map((name) => {
        const product = products.find(
          (p) => p.creatorName?.toLowerCase() === name.toLowerCase()
        );
        if (!product) return null;
        return {
          name: product.creatorName || name,
          avatarUrl: product.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          productId: product.id,
          productName: product.name,
        };
      })
      .filter((builder): builder is FeaturedBuilder => builder !== null);
  })();

  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
            Featured Builders
          </h2>
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredBuilders.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
          Featured Builders
        </h2>
        
        <ScrollArea className="w-full">
          <div className="flex justify-center gap-8 sm:gap-12 pb-4">
            {featuredBuilders.map((builder) => (
              <Link
                key={builder.productId}
                to={`/product/${builder.productId}`}
                className="group flex flex-col items-center gap-3 min-w-[80px]"
              >
                <div className="relative">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-border transition-all duration-300 group-hover:ring-primary group-hover:ring-offset-2 group-hover:ring-offset-background group-hover:-translate-y-1 group-hover:shadow-lg">
                    <AvatarImage
                      src={builder.avatarUrl}
                      alt={builder.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
                      {builder.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200 text-center max-w-[100px] truncate">
                  {builder.name}
                </span>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
