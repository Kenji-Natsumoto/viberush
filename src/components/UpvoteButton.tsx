import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps {
  initialVotes: number;
  productId: string;
}

export function UpvoteButton({ initialVotes, productId }: UpvoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (hasVoted) {
      setVotes(votes - 1);
      setHasVoted(false);
    } else {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  return (
    <button
      onClick={handleVote}
      className={cn(
        "flex flex-col items-center justify-center min-w-[52px] px-3 py-2 rounded-lg border transition-all duration-200",
        "hover:scale-105 active:scale-95",
        hasVoted
          ? "bg-upvote text-upvote-foreground border-upvote shadow-upvote"
          : "bg-card text-muted-foreground border-border hover:border-upvote hover:text-upvote"
      )}
    >
      <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
      <span className="text-sm font-semibold tabular-nums">{votes}</span>
    </button>
  );
}
