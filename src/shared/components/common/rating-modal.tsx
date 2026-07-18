"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

const SCORES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRating: number | null;
  averageRating: number;
  ratingCount: number;
  onRate: (score: number) => void;
  isPending: boolean;
}

function StarDisplay({ filled, half }: { filled: boolean; half: boolean }) {
  return (
    <span className="relative inline-block h-6 w-6">
      <Star
        className={`absolute inset-0 h-6 w-6 ${
          filled ? "fill-gold text-gold" : half ? "fill-gold/40 text-gold" : "fill-none text-muted-foreground/30"
        }`}
      />
      {half && (
        <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
          <Star className="h-6 w-6 fill-gold text-gold" />
        </span>
      )}
    </span>
  );
}

export function RatingModal({ open, onOpenChange, currentRating, averageRating, ratingCount, onRate, isPending }: RatingModalProps) {
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const display = hoverScore ?? currentRating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Your rating</DialogTitle>
          <DialogDescription>
            Tap a star to rate. Each star can be half-filled.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div
            className="flex gap-0.5"
            onMouseLeave={() => setHoverScore(null)}
          >
              {[1, 2, 3, 4, 5].map((star) => {
              const filled = display != null && display >= star;
              const half = display != null && display >= star - 0.5 && display < star;
              return (
                <div key={star} className="relative flex gap-0">
                  <button
                    type="button"
                    className="absolute inset-0 z-10 w-1/2 h-full"
                    onClick={() => onRate(star - 0.5)}
                    onMouseEnter={() => setHoverScore(star - 0.5)}
                    aria-label={`${star - 0.5} stars`}
                  />
                  <button
                    type="button"
                    className="w-6 h-6"
                    onClick={() => onRate(star)}
                    onMouseEnter={() => setHoverScore(star)}
                    aria-label={`${star} stars`}
                  >
                    <StarDisplay filled={filled} half={half} />
                  </button>
                </div>
              );
            })}
          </div>

          {display != null && (
            <span className="text-lg font-semibold">{display.toFixed(1)}</span>
          )}
          {currentRating == null && display == null && (
            <span className="text-sm text-muted-foreground">You haven't rated this fic yet</span>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground border-t border-border pt-3">
          Average: {averageRating.toFixed(1)} ({ratingCount} rating{ratingCount !== 1 ? "s" : ""})
        </div>
      </DialogContent>
    </Dialog>
  );
}