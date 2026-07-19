"use client";

export const dynamic = "force-dynamic";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Heart, Star, ExternalLink, ArrowLeft, MessageCircle, Send, Bookmark, RefreshCw, Calendar, User, ChevronDown, Loader2, Link as LinkIcon, Check, Flag } from "lucide-react";
import { usePageTitle } from "@/shared/hooks/use-page-title";
import { useFic, useRateFic, useToggleFavorite, useToggleReadLater, useAddComment, useRefreshFic } from "@/features/fics/hooks";
import { useAuth } from "@/features/auth";
import { FicDetailSkeleton } from "@/shared/components/common/fic-card-skeleton";
import { FicStatsBar } from "@/shared/components/common/fic-stats-bar";
import { RatingModal } from "@/shared/components/common/rating-modal";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { Breadcrumbs } from "@/shared/components/common/breadcrumbs";
import { FeedbackDialog } from "@/shared/components/common/feedback-dialog";

export default function FicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: fic, isLoading, error } = useFic(id);
  usePageTitle(fic?.title);
  const rateFic = useRateFic();
  const toggleFav = useToggleFavorite();
  const toggleReadLater = useToggleReadLater();
  const addComment = useAddComment();
  const refreshFic = useRefreshFic();
  const [comment, setComment] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error("Failed to copy link"));
  }, []);
  const descRef = (el: HTMLParagraphElement | null) => {
    if (el && el.scrollHeight > el.clientHeight) {
      el.dataset.clampable = "true";
    }
  };

  if (isLoading) return <FicDetailSkeleton />;

  if (error || !fic) throw notFound();
  const ficData = fic;

  const avgRating = ficData.ratings?.length
    ? ficData.ratings.reduce((a, b) => a + (typeof b === "number" ? b : b.score), 0) / ficData.ratings.length
    : 0;
  const userRating = user && ficData.ratings?.length
    ? (ficData.ratings.find((r: any) => r.userId === user.id)?.score ?? null)
    : null;
  const fav = user ? ficData.favoritedBy?.some((f: any) => f.id === user.id) : false;
  const inReadingList = user ? ficData.readBy?.some((r: any) => r.id === user.id) : false;

  const favCount = ficData._count?.favoritedBy ?? 0;
  const commentCount = ficData.comments?.length ?? 0;
  const ratingCount = ficData.ratings?.length ?? 0;

  function handleRate(score: number) {
    rateFic.mutate({ ficId: ficData.id, score }, {
      onSuccess: () => {
        toast.success(`You rated with ${score.toFixed(1)} star${score !== 1 ? "s" : ""}!`);
        setRatingOpen(false);
      },
      onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to rate"),
    });
  }

  return (
    <div>
      <div className="relative overflow-hidden bg-hero border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs items={[
            { label: "Browse", href: "/browse" },
            { label: ficData.title },
          ]} />

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-background/40 border-border/60">
                {ficData.status}
              </Badge>
              {ficData.mature && (
                <Badge className="bg-destructive/90 text-destructive-foreground border-0">
                  18+
                </Badge>
              )}
            </div>

            <h1 className="font-display text-4xl md:text-5xl leading-tight mt-4">{ficData.title}</h1>
            <p className="text-muted-foreground mt-2">
              by <span className="text-foreground">{ficData.author}</span>
            </p>

            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = avgRating >= n;
                  const half = avgRating >= n - 0.5 && avgRating < n;
                  return (
                    <span key={n} className="relative inline-block h-5 w-5">
                      <Star
                        className={`absolute inset-0 h-5 w-5 ${
                          filled ? "fill-gold text-gold" : half ? "fill-gold/40 text-gold" : "fill-none text-muted-foreground/30"
                        }`}
                      />
                      {half && (
                        <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                          <Star className="h-5 w-5 fill-gold text-gold" />
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating ? avgRating.toFixed(1) : "Unrated"} ({ratingCount})
              </span>
              {user && (
                <button
                  onClick={() => setRatingOpen(true)}
                  className="ml-auto text-xs text-primary-glow hover:underline"
                >
                  {userRating != null ? `Your rating: ${userRating.toFixed(1)}` : "Rate"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs uppercase tracking-widest text-primary-glow">
                {ficData.fandoms.join(" · ")}
              </span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-xs text-muted-foreground">{ficData.language}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Button
                variant={fav ? "default" : "outline"}
                onClick={() => user && toggleFav.mutate({ ficId: ficData.id, userId: user.id })}
                className={fav ? "bg-gradient-primary" : "border-border"}
                size="sm"
              >
                <Heart className={`h-4 w-4 mr-1.5 ${fav ? "fill-current" : ""}`} />
                {fav ? "Saved" : "Favorite"}
              </Button>

              <Button
                variant={inReadingList ? "default" : "outline"}
                onClick={() => user && toggleReadLater.mutate({ ficId: ficData.id, userId: user.id })}
                className={inReadingList ? "bg-gradient-primary" : "border-border"}
                size="sm"
              >
                <Bookmark className={`h-4 w-4 mr-1.5 ${inReadingList ? "fill-current" : ""}`} />
                {inReadingList ? "Saved" : "Read later"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-border"
                disabled={!ficData.link || refreshFic.isPending}
                onClick={() => {
                  if (!ficData.link) return
                  refreshFic.mutate(ficData.id, {
                    onSuccess: () => toast.success("Fic updated successfully!"),
                    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update"),
                  })
                }}
                title={!ficData.link ? "No source URL to refresh" : ""}
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshFic.isPending ? "animate-spin" : ""}`} />
                {refreshFic.isPending ? "Updating…" : "Update"}
              </Button>

              <Button variant="outline" size="sm" className="border-border" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 mr-1.5" /> : <LinkIcon className="h-4 w-4 mr-1.5" />}
                {copied ? "Copied!" : "Copy link"}
              </Button>
              {user && (
                <Button variant="outline" size="sm" className="border-border" onClick={() => setReportOpen(true)}>
                  <Flag className="h-4 w-4 mr-1.5" /> Report
                </Button>
              )}
              {ficData.link && (
                <Button variant="outline" asChild className="border-border" size="sm">
                  <a href={ficData.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1.5" /> Original
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-card/60 border border-border/60 backdrop-blur">
              <FicStatsBar
                words={ficData.words}
                chapters={ficData.chapters}
                commentsCount={commentCount}
                favoritesCount={favCount}
                ratingsCount={ratingCount}
              />
            </div>

            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              {ficData.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Published {new Date(ficData.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              )}
              {ficData.externalUpdatedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Updated {new Date(ficData.externalUpdatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              )}
              {(fic as any).addedBy && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  Added{(fic as any).addedBy?.name ? <> by <Link href={`/profile/${(fic as any).addedBy.id}`} className="hover:text-primary-glow transition">@{(fic as any).addedBy.name}</Link></> : ""} · {new Date(ficData.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-10">
        <section>
          <h2 className="font-display text-xl mb-4">Summary</h2>
          <div className="relative">
            <p
              ref={descRef}
              className={`text-base leading-relaxed text-foreground/90 ${!descExpanded ? "line-clamp-4" : ""}`}
            >
              {ficData.description}
            </p>
            {!descExpanded && (
              <button
                onClick={() => setDescExpanded(true)}
                className="mt-2 text-sm text-primary-glow hover:underline inline-flex items-center gap-1"
              >
                Show more <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}
            {descExpanded && ficData.description.length > 300 && (
              <button
                onClick={() => setDescExpanded(false)}
                className="mt-2 text-sm text-primary-glow hover:underline"
              >
                Show less
              </button>
            )}
          </div>
        </section>

        {ficData.tags?.length > 0 && (
          <section>
            <h2 className="font-display text-xl mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {ficData.tags.map((t: string) => (
                <Link
                  key={t}
                  href={`/browse?tags=${encodeURIComponent(t)}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-2 border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-surface-2/80 transition"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> {favCount} favorite{favCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" /> {commentCount} comment{commentCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4" /> {ratingCount} rating{ratingCount !== 1 ? "s" : ""}
            </span>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="h-5 w-5 text-primary-glow" />
            <h2 className="font-display text-2xl">Comments ({commentCount})</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 mb-6">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you thought about this fic…"
              className="bg-surface border-border min-h-[100px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">{comment.length}/1000</span>
              <Button
                size="sm"
                className="bg-gradient-primary"
                disabled={!comment.trim() || addComment.isPending}
                onClick={() => {
                  addComment.mutate({ ficId: ficData.id, text: comment.trim() }, {
                    onSuccess: () => {
                      setComment("");
                      toast.success("Comment posted");
                    },
                  });
                }}
              >
                {addComment.isPending ? (
                  <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Posting…</>
                ) : (
                  <><Send className="h-3.5 w-3.5 mr-2" /> Post</>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {!ficData.comments?.length ? (
              <p className="text-center text-muted-foreground py-8">Be the first to comment.</p>
            ) : (
              ficData.comments.map((c: { id: string; user: string; text: string; createdAt: string }) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-xs font-semibold text-primary-foreground">
                      {typeof c.user === "string" ? c.user[0]?.toUpperCase() : (c.user as any).name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <Link
                      href={`/profile/${typeof c.user === "string" ? c.user : (c.user as any).id}`}
                      className="font-medium text-sm hover:text-primary-glow transition"
                    >
                      @{typeof c.user === "string" ? c.user : (c.user as any).name ?? "?"}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    <FeedbackDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        defaultType="report"
        ficId={ficData.id}
        ficTitle={ficData.title}
        requiresAuth
        isAuthenticated={!!user}
      />
    <RatingModal
        open={ratingOpen}
        onOpenChange={setRatingOpen}
        currentRating={userRating}
        averageRating={avgRating}
        ratingCount={ratingCount}
        onRate={handleRate}
        isPending={rateFic.isPending}
      />
    </div>
  );
}
