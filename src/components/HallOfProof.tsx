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
    indicators.push("Publicly accessible");
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
    <div className="group bg-card border border-border/50 rounded-lg p-6 transition-all duration-200 hover:bg-muted/30 hover:border-border">
      {/* 1) Product Name - Primary, largest text */}
      <h3 className="text-lg font-semibold text-foreground truncate mb-2">
        {product.name}
      </h3>
      
      {/* 2) One-line Description - Present tense, what's running */}
      <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
        {product.tagline}
      </p>
      
      {/* 3) Build Context - Two factual lines */}
      <div className="space-y-1 mb-4">
        <p className="text-xs text-muted-foreground/80">
          Built with: <span className="text-foreground/70">{mainPlatform}</span>
        </p>
        <p className="text-xs text-muted-foreground/80">
          Time to build: <span className="text-foreground/70">{product.timeToBuild || "—"}</span>
        </p>
      </div>
      
      {/* 4) Proof Indicators - Minimal, optional */}
      {proofIndicators.length > 0 && (
        <div className="flex gap-3 mb-4">
          {proofIndicators.map((indicator) => (
            <span 
              key={indicator} 
              className="text-[10px] text-muted-foreground/60 uppercase tracking-wider"
            >
              {indicator}
            </span>
          ))}
        </div>
      )}
      
      {/* 5) Maker - Secondary metadata at bottom */}
      <p className="text-xs text-muted-foreground/50">
        by {product.creatorName || "Vibe Coder"}
      </p>
    </div>
  );
}

function ProofCardSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-lg p-6">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="space-y-1 mb-4">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-3 w-1/4" />
    </div>
  );
}

export function HallOfProof() {
  const { products, isLoading } = useProducts();

  // Select featured products: is_featured === true, newest first, max 5
  const featuredProducts = useMemo(() => {
    return products
      .filter((p) => p.isFeatured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [products]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Hall of Proof
            </h2>
            <p className="text-sm text-muted-foreground">
              Only proof from the top 1% of AI-native products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
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
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Hall of Proof
          </h2>
          <p className="text-sm text-muted-foreground">
            Only proof from the top 1% of AI-native products
          </p>
        </div>
        
        {/* Proof Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.map((product) => (
            <ProofCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
