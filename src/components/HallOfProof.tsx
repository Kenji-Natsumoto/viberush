import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Globe, Radio } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolBadge } from "@/components/ToolBadge";
import { TOOL_CATEGORIES } from "@/lib/toolConfig";
import type { Product, Tool } from "@/types/database";

const AI_CODING_ASSISTANTS = TOOL_CATEGORIES.find(
  (cat) => cat.label === "AI Coding Assistants"
)?.tools ?? [];


function getProofIndicators(product: Product): string[] {
  const indicators: string[] = [];
  if (product.url) indicators.push("Publicly Accessible");
  if (product.demoUrl) indicators.push("Live");
  return indicators.slice(0, 2);
}

const MAX_VISIBLE = 4;

function ProofCard({ product }: { product: Product }) {
  const mainTool = product.tools.find((tool) => AI_CODING_ASSISTANTS.includes(tool));
  const proofIndicators = getProofIndicators(product);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex-shrink-0 w-64 sm:w-72 bg-[#F0F0F0] dark:bg-card border border-border/40 rounded-sm p-5 transition-colors duration-150 hover:bg-[#E5E5E5] dark:hover:bg-muted/50 block"
    >
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-muted flex-shrink-0">
          {product.iconUrl ? (
            <img src={product.iconUrl} alt={`${product.name} icon`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-lg font-semibold text-muted-foreground">{product.name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">{product.name}</h3>
          {product.tagline && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{product.tagline}</p>
          )}
        </div>
      </div>

      {/* Proof indicators as prominent pills */}
      {proofIndicators.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {proofIndicators.map((ind) => (
            <span
              key={ind}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full"
            >
              {ind === "Publicly Accessible" ? <Globe className="h-3 w-3" /> : <Radio className="h-3 w-3" />}
              {ind}
            </span>
          ))}
        </div>
      )}

      {/* Built with - reuse ToolBadge for consistency with rankings */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span className="text-xs text-muted-foreground">Built with:</span>
        {mainTool ? (
          <ToolBadge tool={mainTool} />
        ) : (
          <span className="text-xs text-foreground/80">—</span>
        )}
      </div>

      {/* Time to build - distinct warm pill */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-xs text-muted-foreground">Time:</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground bg-white dark:bg-white/90 px-2 py-0.5 rounded-full">
          <Clock className="h-3 w-3" />
          {product.timeToBuild || "—"}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">Maker: <span className="font-medium text-foreground/90">{product.creatorName || "Vibe Coder"}</span></p>
    </Link>
  );
}

function MoreCard() {
  return (
    <div
      className="flex-shrink-0 w-64 sm:w-72 bg-[#F0F0F0] dark:bg-card border border-border/40 rounded-sm p-5 flex items-center justify-center"
    >
      <span className="text-sm font-medium text-muted-foreground">More Proof</span>
    </div>
  );
}

function ProofCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 sm:w-72 bg-[#F0F0F0] dark:bg-card border border-border/40 rounded-sm p-5">
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
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const featuredProducts = useMemo(() => {
    return products
      .filter((p) => p.isFeatured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products]);

  const visibleProducts = featuredProducts.slice(0, MAX_VISIBLE);
  const hasMore = featuredProducts.length > MAX_VISIBLE;

  const allCards = [...visibleProducts, null];

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">Hall of Proof</h2>
            <p className="text-sm text-muted-foreground">Only proof from the top 1% of AI-native products</p>
          </div>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide justify-center">
            {[1, 2, 3, 4].map((i) => (
              <ProofCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length < 3) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">Hall of Proof</h2>
          <p className="text-sm text-muted-foreground">Only proof from the top 1% of AI-native products</p>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex gap-5 w-max hall-of-proof-scroll"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {/* Original set */}
            {allCards.map((item, i) =>
              item ? (
                <ProofCard key={`a-${item.id}`} product={item} />
              ) : (
                <MoreCard key={`a-more`} />
              )
            )}
            {/* Duplicate set for seamless loop */}
            {allCards.map((item, i) =>
              item ? (
                <ProofCard key={`b-${item.id}`} product={item} />
              ) : (
                <MoreCard key={`b-more`} />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
