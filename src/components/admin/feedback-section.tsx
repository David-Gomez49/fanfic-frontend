"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trash2, ChevronLeft, ChevronRight, Check, X, MessageSquare, Bug, Lightbulb, Flag, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAdminFeedback, useUpdateFeedbackStatus, useDeleteFeedback } from "@/hooks/use-admin";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmModal } from "@/components/confirm-modal";
import { CardSkeleton } from "@/components/admin/table-skeleton";
import { EmptyState } from "@/components/empty-state";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  report: { label: "Report", icon: <Flag className="h-3 w-3" />, color: "text-red-500 bg-red-500/10 border-red-500/30" },
  suggestion: { label: "Suggestion", icon: <Lightbulb className="h-3 w-3" />, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
  bug: { label: "Bug", icon: <Bug className="h-3 w-3" />, color: "text-orange-500 bg-orange-500/10 border-orange-500/30" },
  other: { label: "Other", icon: <MessageSquare className="h-3 w-3" />, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30" },
  resolved: { label: "Resolved", color: "text-green-500 bg-green-500/10 border-green-500/30" },
  dismissed: { label: "Dismissed", color: "text-muted-foreground bg-surface-2 border-border" },
};

export default function FeedbackSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useAdminFeedback(page, q, typeFilter, statusFilter);
  const updateStatus = useUpdateFeedbackStatus();
  const deleteFeedback = useDeleteFeedback();
  const [confirm, setConfirm] = useState<string | null>(null);

  const handleSearch = () => { setQ(search); setPage(1); };

  const handleDelete = () => {
    if (!confirm) return;
    deleteFeedback.mutate(confirm, {
      onSuccess: () => { setConfirm(null); toast("Feedback deleted", { duration: 3000 }); },
      onError: () => toast.error("Failed to delete feedback"),
    });
  };

  const handleStatus = (id: string, status: string) => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => toast(`Marked as ${status}`, { duration: 3000 }),
      onError: () => toast.error("Failed to update status"),
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search feedback…" className="pl-9 bg-surface border-border" />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground"
        >
          <option value="">All types</option>
          <option value="report">Report</option>
          <option value="suggestion">Suggestion</option>
          <option value="bug">Bug</option>
          <option value="other">Other</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground"
        >
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <Button variant="outline" size="sm" onClick={handleSearch} className="border-border">Search</Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <CardSkeleton count={5} />
        ) : !data?.data.length ? (
          <EmptyState icon={MessageSquare} title="No feedback found." />
        ) : data.data.map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${TYPE_CONFIG[f.type]?.color || ''}`}>
                    {TYPE_CONFIG[f.type]?.icon}
                    {TYPE_CONFIG[f.type]?.label || f.type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[f.status]?.color || ''}`}>
                    {STATUS_CONFIG[f.status]?.label || f.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(f.createdAt).toLocaleDateString()}</span>
                </div>

                {f.subject && (
                  <p className="text-sm font-medium">{f.subject}</p>
                )}

                <p className="text-sm text-foreground/90 line-clamp-3">{f.text}</p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {f.user ? (
                    <Link href={`/profile/${f.user.id}`} target="_blank" className="hover:text-primary-glow transition">@{f.user.name}</Link>
                  ) : (
                    <span>Anonymous</span>
                  )}
                  {f.fic && (
                    <Link href={`/fic/${f.fic.id}`} target="_blank" className="inline-flex items-center gap-1 hover:text-primary-glow transition">
                      <ExternalLink className="h-3 w-3" /> {f.fic.title}
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {f.status === "pending" && (
                  <>
                    <button onClick={() => handleStatus(f.id, "resolved")} className="text-muted-foreground hover:text-green-500 transition p-1" title="Mark resolved" aria-label="Mark resolved">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleStatus(f.id, "dismissed")} className="text-muted-foreground hover:text-muted-foreground/60 transition p-1" title="Dismiss" aria-label="Dismiss">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button onClick={() => setConfirm(f.id)} className="text-muted-foreground hover:text-destructive transition p-1" title="Delete feedback" aria-label="Delete feedback">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
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
        title="Delete feedback?"
        description="This cannot be undone."
        isLoading={deleteFeedback.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
