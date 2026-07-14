"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Edit3, ChevronLeft, ChevronRight, X, Check, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAdminComments, useDeleteComment } from "@/hooks/use-admin";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/confirm-modal";
import { CardSkeleton } from "@/components/admin/table-skeleton";
import { EmptyState } from "@/components/empty-state";

export default function CommentsSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const { data, isLoading } = useAdminComments(page, q);
  const deleteComment = useDeleteComment();
  const [confirm, setConfirm] = useState<string | null>(null);

  const handleSearch = () => { setQ(search); setPage(1); };

  const handleDelete = () => {
    if (!confirm) return;
    deleteComment.mutate(confirm, {
      onSuccess: () => { setConfirm(null); toast("Comment deleted", { duration: 3000 }); },
      onError: () => toast.error("Failed to delete comment"),
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search comments…" className="pl-9 bg-surface border-border" />
        </div>
        <Button variant="outline" size="sm" onClick={handleSearch} className="border-border">Search</Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <CardSkeleton count={5} />
        ) : !data?.data.length ? (
          <EmptyState icon={MessageSquare} title="No comments found." />
        ) : data.data.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Link href={`/profile/${c.user.id}`} target="_blank" className="font-medium text-foreground hover:text-primary-glow transition">@{c.user.name}</Link>
                  <span>on</span>
                  <Link href={`/fic/${c.fic.id}`} target="_blank" className="truncate hover:text-primary-glow transition">{c.fic.title}</Link>
                  <span>· {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm line-clamp-3">{c.text}</p>
              </div>
              <button onClick={() => setConfirm(c.id)} className="text-muted-foreground hover:text-destructive transition shrink-0 p-1" title="Delete comment" aria-label="Delete comment">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-border" aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{page} / {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="border-border" aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        onOpenChange={(o) => { if (!o) setConfirm(null); }}
        title="Delete comment?"
        description="This cannot be undone."
        isLoading={deleteComment.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
