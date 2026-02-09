import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { TOOL_CATEGORIES } from "@/lib/toolConfig";
import type { Product, Tool } from "@/types/database";

// AI Coding Assistants list for main platform extraction
const AI_CODING_ASSISTANTS = TOOL_CATEGORIES.find(
  (cat) => cat.label === "AI Coding Assistants"
)?.tools ?? [];

// Extract the primary AI coding assistant from tools array
function extractMainPlatform(tools: Tool[]): string {
  const mainTool = tools.find((tool) => 
    AI_CODING_ASSISTANTS.includes(tool)
  );
  return mainTool ?? "—";
}

// Proof indicators - only display if we can infer from data
function getProofIndicators(product: Product): string[] {
  const indicators: string[] = [];
  
  // If product has a URL, it's publicly accessible
  if (product.url) {
    indicators.push("Publicly Accessible");
  }
  
  // If product has a demo URL, it's live
  if (product.demoUrl) {
    indicators.push("Live");
  }
  
  return indicators.slice(0, 2); // Max 2 indicators
}

interface ProofCardProps {
  product: Product;
}

function ProofCard({ product }: ProofCardProps) {
  const mainPlatform = extractMainPlatform(product.tools);
  const proofIndicators = getProofIndicators(product);
  
  return (
    <div className="group bg-[#FAFAFA] dark:bg-card border border-border/40 rounded-md p-5 transition-colors duration-150 hover:bg-[#F5F5F5] dark:hover:bg-muted/30">
      {/* 1) Product Icon */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {product.iconUrl ? (
            <img 
              src={product.iconUrl} 
              alt={`${product.name} icon`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-lg font-semibold text-muted-foreground">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 2) Product Name */}
          <h3 className="text-base font-semibold text-foreground truncate">
            {product.name}
          </h3>
          
          {/* 3) Product Tagline */}
          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>
      </div>
      
      {/* 4) Proof Indicators */}
      {proofIndicators.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {proofIndicators.map((indicator) => (
            <span 
              key={indicator} 
              className="text-[11px] text-muted-foreground/70 bg-muted/50 dark:bg-muted/30 px-2 py-0.5 rounded"
            >
              {indicator}
            </span>
          ))}
        </div>
      )}
      
      {/* 5) Build Context */}
      <div className="space-y-1 mb-3 text-xs text-muted-foreground">
        <p>
          Built with: <span className="text-foreground/80">{mainPlatform}</span>
        </p>
        <p>
          Time to build: <span className="text-foreground/80">{product.timeToBuild || "—"}</span>
        </p>
      </div>
      
      {/* 6) Maker Name */}
      <p className="text-xs text-muted-foreground/60">
        by {product.creatorName || "Vibe Coder"}
      </p>
    </div>
  );
}

function ProofCardSkeleton() {
  return (
    <div className="bg-[#FAFAFA] dark:bg-card border border-border/40 rounded-md p-5">
      <div className="flex items-start gap-4 mb-3">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
      </div>
      <div className="space-y-1 mb-3">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-3 w-1/4" />
    </div>
  );
}

export function HallOfProof() {
  const { products, isLoading } = useProducts();

  // Select featured products: is_featured === true, newest first, max 10
  const featuredProducts = useMemo(() => {
    return products
      .filter((p) => p.isFeatured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [products]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Hall of Proof
            </h2>
            <p className="text-sm text-muted-foreground">
              Only proof from the top 1% of AI-native products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ProofCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render if fewer than 3 featured products
  if (featuredProducts.length < 3) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Hall of Proof
          </h2>
          <p className="text-sm text-muted-foreground">
            Only proof from the top 1% of AI-native products
          </p>
        </div>
        
        {/* Proof Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProofCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
