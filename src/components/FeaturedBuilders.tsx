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
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[hsl(35,20%,93%)] to-[hsl(35,18%,90%)] dark:from-[hsl(35,10%,12%)] dark:to-[hsl(35,8%,10%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
              Community
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Featured Builders
            </h2>
          </div>
          <div className="flex justify-center gap-10 sm:gap-16 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full" />
                <Skeleton className="h-4 w-24" />
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[hsl(35,20%,93%)] to-[hsl(35,18%,90%)] dark:from-[hsl(35,10%,12%)] dark:to-[hsl(35,8%,10%)] border-y border-amber-200/50 dark:border-amber-800/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
            Community
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Featured Builders
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Meet the creators behind the most vibed apps
          </p>
        </div>
        
        {/* Avatar container with overflow-visible and padding for hover lift */}
        <div className="overflow-visible">
          <ScrollArea className="w-full overflow-visible">
            <div className="flex justify-center gap-10 sm:gap-16 lg:gap-20 pt-4 pb-6">
              {featuredBuilders.map((builder) => (
                <Link
                  key={builder.productId}
                  to={`/product/${builder.productId}`}
                  className="group flex flex-col items-center gap-4 min-w-[100px]"
                >
                  {/* Avatar wrapper with padding for hover animation space */}
                  <div className="relative pt-3">
                    {/* Outer decorative ring - behind avatar */}
                    <div className="absolute inset-0 top-3 -m-1 rounded-full bg-gradient-to-br from-amber-300 via-orange-300 to-amber-400 dark:from-amber-600 dark:via-orange-500 dark:to-amber-600 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
                    
                    {/* Avatar container with z-index to stay on top */}
                    <div className="relative z-10">
                      <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-[3px] ring-amber-200/80 dark:ring-amber-700/50 bg-background transition-all duration-300 ease-out group-hover:ring-amber-400 dark:group-hover:ring-amber-500 group-hover:-translate-y-3 group-hover:shadow-xl group-hover:shadow-amber-500/20">
                        <AvatarImage
                          src={builder.avatarUrl}
                          alt={builder.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-800 dark:text-amber-200">
                          {builder.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Floating sparkle indicator */}
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 z-20">
                        <span className="text-[10px]">✨</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Builder name */}
                  <div className="text-center">
                    <span className="text-sm font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-200 block max-w-[120px] truncate">
                      {builder.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View project →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
