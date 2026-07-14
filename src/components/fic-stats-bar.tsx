function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface FicStatsBarProps {
  words?: number | null;
  chapters?: number | null;
  commentsCount?: number;
  favoritesCount?: number;
  ratingsCount?: number;
}

export function FicStatsBar({ words, chapters, commentsCount, favoritesCount, ratingsCount }: FicStatsBarProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-6">
        <span><strong className="tabular-nums">{fmt(words)}</strong><span className="text-muted-foreground ml-1 text-xs">Words</span></span>
        <span><strong className="tabular-nums">{fmt(chapters)}</strong><span className="text-muted-foreground ml-1 text-xs">Chapters</span></span>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {commentsCount != null && <span>{commentsCount} comment{commentsCount !== 1 ? "s" : ""}</span>}
        {favoritesCount != null && <span>{favoritesCount} favorite{favoritesCount !== 1 ? "s" : ""}</span>}
        {ratingsCount != null && <span>{ratingsCount} rating{ratingsCount !== 1 ? "s" : ""}</span>}
      </div>
    </div>
  );
}
