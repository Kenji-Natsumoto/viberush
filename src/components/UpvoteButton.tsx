import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleVote, useUserVotes } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UpvoteButtonProps {
  initialVotes: number;
  productId: string;
  size?: "default" | "sm";
}

export function UpvoteButton({ initialVotes, productId, size = "default" }: UpvoteButtonProps) {
  const isSmall = size === "sm";
  const { user, isAnonymous } = useAuth();
  const navigate = useNavigate();
  const { data: userVotes = new Set() } = useUserVotes();
  const toggleVote = useToggleVote();
  
  const hasVoted = userVotes.has(productId);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || isAnonymous) {
      navigate('/auth?mode=signup');
      return;
    }
    
    toggleVote.mutate({ productId, hasVoted });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleVote}
            disabled={toggleVote.isPending}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border transition-all duration-200",
              "hover:scale-105 active:scale-95",
              isSmall ? "min-w-[36px] px-2 py-1" : "min-w-[52px] px-3 py-2",
              toggleVote.isPending && "opacity-50 cursor-not-allowed",
              hasVoted
                ? "bg-upvote text-upvote-foreground border-upvote shadow-upvote"
                : "bg-card text-muted-foreground border-border hover:border-upvote hover:text-upvote"
            )}
          >
            <ChevronUp className={isSmall ? "h-3 w-3" : "h-4 w-4"} strokeWidth={2.5} />
            <span className={cn("font-semibold tabular-nums", isSmall ? "text-[10px]" : "text-sm")}>{initialVotes}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-[180px] text-center">
          <p>▲ Upvote — one vote per person</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
