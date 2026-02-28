import { Clock, ExternalLink, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ToolBadge } from "./ToolBadge";
import { UpvoteButton } from "./UpvoteButton";
import { VibeButton } from "./VibeButton";
import { useAuth } from "@/contexts/AuthContext";

import type { Product } from "@/types/database";
import { getProductIconUrl } from "@/lib/iconUtils";

interface ProductCardProps {
  product: Product;
  rank: number;
  creatorId?: string; // The user ID of the product creator
}

export function ProductCard({ product, rank, creatorId }: ProductCardProps) {
  const { user } = useAuth();
  // Edit permission: user_id matches OR owner_id matches
  const isOriginalSubmitter = user && (creatorId ? user.id === creatorId : user.id === product.userId);
  const isTransferredOwner = user && product.ownerId === user.id;
  const isOwner = isOriginalSubmitter || isTransferredOwner;

  return (
    <>
      <Link to={`/product/${product.id}`} className="block group">
        <div className="p-4 bg-card border border-border rounded-xl transition-all duration-200 hover:shadow-card-hover hover:border-muted-foreground/20">
          {/* Top row: Rank + Icon + Product info (full width on mobile) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Rank - desktop only */}
            <div className="hidden sm:flex items-center justify-center w-8 text-lg font-semibold text-muted-foreground">
              {rank}
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
              <img
                src={product.iconUrl}
                alt={product.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-[6px] object-cover border border-border"
                onError={(e) => {
                  e.currentTarget.src = getProductIconUrl(product.name);
                }}
              />
            </div>

            {/* Content — takes full remaining width on mobile */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 sm:truncate">
                  {product.name}
                </h3>
                <a
                  href={product.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
                    !product.url && "hidden"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </a>
              </div>
              
              {product.tagline && (
                <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 line-clamp-1">
                  {product.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {product.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tools.map((tool) => (
                      <ToolBadge key={tool} tool={tool} />
                    ))}
                  </div>
                )}
                {product.timeToBuild && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{product.timeToBuild}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop action buttons — inline */}
            <div className="hidden sm:flex flex-shrink-0 items-center gap-3">
              {isOwner && (
                <Link
                  to={`/more-detail?product=${product.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="More Details"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  More Details
                </Link>
              )}
              <VibeButton score={product.vibeScore} productId={product.id} />
              <UpvoteButton initialVotes={product.votes} productId={product.id} />
            </div>
          </div>

          {/* Mobile action buttons — bottom row, full width */}
          <div className="flex sm:hidden items-center justify-end gap-3 mt-3 pt-3 border-t border-border/50">
            {isOwner && (
              <Link
                to={`/more-detail?product=${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="More Details"
              >
                <Pencil className="h-3.5 w-3.5" />
                More Details
              </Link>
            )}
            <VibeButton score={product.vibeScore} productId={product.id} size="sm" />
            <UpvoteButton initialVotes={product.votes} productId={product.id} />
          </div>
        </div>
      </Link>

    </>
  );
}
