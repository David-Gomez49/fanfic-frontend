import Link from "next/link";
import { Heart, Star, MessageCircle, BookOpen, Calendar, Bookmark } from "lucide-react";
function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
import type { Fanfic } from "@/features/fics/types";
import { useAuth } from "@/features/auth";
import { useToggleFavorite, useToggleReadLater } from "@/features/fics/hooks";
import { Badge } from "@/shared/components/ui/badge";
import { highlightText } from "@/shared/lib/highlight";

const STATUS_STYLES: Record<string, string> = {
  complete: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "in progress": "bg-primary/15 text-primary-glow border-primary/30",
  paused: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  abandoned: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const maturityBadge = (mature: boolean) => {
  if (mature) return { label: "Mature", className: "bg-destructive/10 text-destructive border-destructive/20" };
  return { label: "General", className: "bg-surface-2/80 text-muted-foreground border-border" };
};

function avgRating(fic: Fanfic) {
  if (!fic.ratings?.length) return 0;
  return fic.ratings.reduce((a, b) => a + (typeof b === "number" ? b : b.score), 0) / fic.ratings.length;
}

export function FicCardList({ fic, highlight, style }: { fic: Fanfic; highlight?: string; style?: React.CSSProperties }) {
  const { user } = useAuth();
  const toggleFav = useToggleFavorite();
  const toggleReadLater = useToggleReadLater();
  const fav = user ? fic.favoritedBy?.some((f: any) => (f.userId ?? f.id) === user.id) : false;
  const inList = user ? fic.readBy?.some((r: any) => (r.id ?? r.userId) === user.id) : false;
  const rating = avgRating(fic);
  const maturity = maturityBadge(fic.mature);

  return (
    <div className="group bg-card border border-border rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col gap-4 relative" style={style}>
      <div className="absolute top-6 right-6 flex gap-2 items-center">
        <Badge variant="outline" className={maturity.className}>
          {maturity.label}
        </Badge>
        <Badge variant="outline" className={STATUS_STYLES[fic.status]}>
          {fic.status}
        </Badge>
      </div>

      <div className="flex flex-col">
        <Link href={`/fic/${fic.id}`} className="group/title">
          <h3 className="font-display text-xl text-foreground group-hover/title:text-primary-glow transition-colors">
            {highlight ? highlightText(fic.title, highlight) : fic.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          por <span className="text-foreground font-medium hover:underline cursor-pointer">{fic.author}</span>
        </p>
        <p className="text-xs uppercase tracking-widest text-primary-glow mt-1">
          {fic.fandoms?.[0]}{fic.fandoms?.length != null && fic.fandoms.length > 1 ? ` +${fic.fandoms.length - 1}` : ""}
          <span className="text-xs text-muted-foreground not-uppercase tracking-normal ml-2">· {fic.language}</span>
        </p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-2">
        {highlight ? highlightText(fic.description, highlight) : fic.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {(fic.tags ?? []).slice(0, 6).map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-surface-2/80 text-xs text-muted-foreground rounded-full border border-border"
          >
            {t}
          </span>
        ))}
        {(fic.tags ?? []).length > 6 && (
          <span className="text-xs text-muted-foreground self-center">+{fic.tags.length - 6}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {fmt(fic.words)} words
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5" />
            {fic.favoritedBy?.length ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            {fic._count?.comments ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-gold" />
            {rating ? rating.toFixed(1) : "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(fic.createdAt).toLocaleDateString("es")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFav.mutate(fic.id);
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-border/60 hover:border-rose-400/60 hover:bg-rose-400/10 transition"
            aria-label="Toggle favorite"
            title="Toggle favorite"
          >
            <Heart
              className={`h-3.5 w-3.5 transition ${fav ? "fill-rose-400 text-rose-400" : "text-muted-foreground"}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleReadLater.mutate(fic.id);
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-border/60 hover:border-primary/60 hover:bg-primary/10 transition"
            aria-label="Toggle reading list"
            title="Toggle reading list"
          >
            <Bookmark className={`h-3.5 w-3.5 transition ${inList ? "fill-primary-glow text-primary-glow" : "text-muted-foreground"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
