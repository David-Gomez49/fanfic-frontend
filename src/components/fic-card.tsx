import Link from "next/link";
import { Heart, Star, MessageCircle, Bookmark } from "lucide-react";
import type { Fanfic } from "@/hooks/use-fics";
import { useAuth } from "@/lib/auth-context";
import { useToggleFavorite, useToggleReadLater } from "@/hooks/use-fics";
import { Badge } from "@/components/ui/badge";
import { highlightText } from "@/lib/highlight";
import type { ReactNode } from "react";

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

export function FicCard({ fic, highlight, style }: { fic: Fanfic; highlight?: string; style?: React.CSSProperties }) {
  const { user } = useAuth();
  const toggleFav = useToggleFavorite();
  const toggleReadLater = useToggleReadLater();
  const fav = user ? fic.favoritedBy?.some((f: any) => (f.userId ?? f.id) === user.id) : false;
  const inList = user ? fic.readBy?.some((r: any) => (r.id ?? r.userId) === user.id) : false;
  const rating = avgRating(fic);
  const maturity = maturityBadge(fic.mature);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/40" style={style}>
      <Link href={`/fic/${fic.id}`} className="flex flex-col flex-1">
        <div className="flex items-start justify-between p-5 pb-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={maturity.className}>
              {maturity.label}
            </Badge>
            <Badge variant="outline" className={STATUS_STYLES[fic.status]}>
              {fic.status}
            </Badge>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {fic.language}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 pt-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-glow mb-1">
              {fic.fandoms?.[0]}{fic.fandoms?.length != null && fic.fandoms.length > 1 ? ` +${fic.fandoms.length - 1}` : ""}
            </p>
            <h3 className="font-display text-lg leading-tight line-clamp-2 group-hover:text-primary-glow transition-colors">
              {highlight ? highlightText(fic.title, highlight) : fic.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">por {fic.author}</p>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{highlight ? highlightText(fic.description, highlight) : fic.description}</p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {(fic.tags ?? []).slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-2/80 text-muted-foreground border border-border"
              >
                {t}
              </span>
            ))}
            {fic.tags && fic.tags.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{fic.tags.length - 4}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface/40">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-gold fill-current" />
            {rating ? rating.toFixed(1) : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {fic.favoritedBy?.length ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {fic._count?.comments ?? 0}
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
