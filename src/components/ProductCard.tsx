import { useState } from "react";
import { Clock, ExternalLink, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ToolBadge } from "./ToolBadge";
import { UpvoteButton } from "./UpvoteButton";
import { VibeButton } from "./VibeButton";
import { EditProductModal } from "./EditProductModal";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Edit permission: user_id matches OR owner_id matches
  const isOriginalSubmitter = user && (creatorId ? user.id === creatorId : user.id === product.userId);
  const isTransferredOwner = user && product.ownerId === user.id;
  const isOwner = isOriginalSubmitter || isTransferredOwner;

  return (
    <>
      <Link to={`/product/${product.id}`} className="block group">
        <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl transition-all duration-200 hover:shadow-card-hover hover:border-muted-foreground/20">
        {/* Rank */}
        <div className="hidden sm:flex items-center justify-center w-8 text-lg font-semibold text-muted-foreground">
          {rank}
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          <img
            src={product.iconUrl}
            alt={product.name}
            className="w-14 h-14 rounded-[6px] object-cover border border-border"
            onError={(e) => {
              e.currentTarget.src = getProductIconUrl(product.name);
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {product.name}
            </h3>
            <a
              href={product.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                !product.url && "hidden"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
          
          {product.tagline && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {product.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {/* Tool Badges */}
            {product.tools.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tools.map((tool) => (
                  <ToolBadge key={tool} tool={tool} />
                ))}
              </div>
            )}

            {/* Time to Build */}
            {product.timeToBuild && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{product.timeToBuild}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {isOwner && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Edit your app"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <VibeButton score={product.vibeScore} productId={product.id} />
          <UpvoteButton initialVotes={product.votes} productId={product.id} />
        </div>
        </div>
      </Link>

      {/* Edit Modal - MUST be outside <Link> to prevent event conflicts */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        onSave={(updatedProduct) => {
          console.log("Product updated:", updatedProduct);
        }}
      />
    </>
  );
}
