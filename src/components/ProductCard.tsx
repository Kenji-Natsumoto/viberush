import { Clock, ExternalLink } from "lucide-react";
import { ToolBadge } from "./ToolBadge";
import { UpvoteButton } from "./UpvoteButton";
import type { Product } from "@/data/dummyProducts";

interface ProductCardProps {
  product: Product;
  rank: number;
}

export function ProductCard({ product, rank }: ProductCardProps) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl transition-all duration-200 hover:shadow-card-hover hover:border-muted-foreground/20">
      {/* Rank */}
      <div className="hidden sm:flex items-center justify-center w-8 text-lg font-semibold text-muted-foreground">
        {rank}
      </div>

      {/* Icon */}
      <div className="flex-shrink-0">
        <img
          src={product.iconUrl}
          alt={product.name}
          className="w-14 h-14 rounded-xl object-cover border border-border"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground truncate">
            {product.name}
          </h3>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </a>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          {product.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tool Badges */}
          <div className="flex flex-wrap gap-1">
            {product.tools.map((tool) => (
              <ToolBadge key={tool} tool={tool} />
            ))}
          </div>

          {/* Time to Build */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{product.timeToBuild}</span>
          </div>
        </div>
      </div>

      {/* Upvote */}
      <div className="flex-shrink-0">
        <UpvoteButton initialVotes={product.votes} productId={product.id} />
      </div>
    </div>
  );
}
