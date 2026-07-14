"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/confirm-modal";
import { Search, Trash2, Edit3, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useAdminFics, useUpdateFic, useDeleteFic } from "@/hooks/use-admin";
import type { AdminFic } from "@/hooks/use-admin";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export default function FicsSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const { data, isLoading } = useAdminFics(page, q);
  const updateFic = useUpdateFic();
  const deleteFic = useDeleteFic();
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null);
  const [editingFic, setEditingFic] = useState<AdminFic | null>(null);
  const [editForm, setEditForm] = useState({
    title: "", author: "", description: "", status: "", language: "",
    mature: false, link: "", words: "", chapters: "", tags: "", fandoms: "",
  });

  const handleSearch = () => {
    setQ(search);
    setPage(1);
  };

  const handleDelete = () => {
    if (!confirm) return;
    deleteFic.mutate(confirm.id, {
      onSuccess: () => { setConfirm(null); toast("Fic deleted", { duration: 3000 }); },
      onError: () => toast.error("Failed to delete fic"),
    });
  };

  const openEdit = (fic: AdminFic) => {
    setEditingFic(fic);
    setEditForm({
      title: fic.title,
      author: fic.author,
      description: fic.description ?? "",
      status: fic.status,
      language: fic.language,
      mature: fic.mature,
      link: fic.link ?? "",
      words: fic.words != null ? String(fic.words) : "",
      chapters: fic.chapters != null ? String(fic.chapters) : "",
      tags: fic.tags.join(", "),
      fandoms: fic.fandoms.join(", "),
    });
  };

  const handleSave = () => {
    if (!editingFic) return;
    const data: Record<string, unknown> = {
      title: editForm.title,
      author: editForm.author,
      description: editForm.description,
      status: editForm.status,
      language: editForm.language,
      mature: editForm.mature,
      link: editForm.link || null,
      words: editForm.words ? Number(editForm.words) : null,
      chapters: editForm.chapters ? Number(editForm.chapters) : null,
      tags: editForm.tags.split(",").map((s) => s.trim()).filter(Boolean),
      fandoms: editForm.fandoms.split(",").map((s) => s.trim()).filter(Boolean),
    };
    updateFic.mutate({ id: editingFic.id, data }, {
      onSuccess: () => { setEditingFic(null); toast.success("Fic updated"); },
      onError: () => toast.error("Failed to update fic"),
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search title or author…"
            className="pl-9 bg-surface border-border"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleSearch} className="border-border">
          Search
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Author</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Fandoms</th>
              <th className="pb-3 pr-4">Added</th>
              <th className="pb-3 pr-4">By</th>
              <th className="pb-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="py-10"><TableSkeleton cols={7} rows={5} /></td></tr>
            ) : !data?.data.length ? (
              <tr><td colSpan={7} className="py-10"><EmptyState icon={BookOpen} title="No fics found." /></td></tr>
            ) : data.data.map((f) => (
              <tr key={f.id} className="border-b border-border/50">
                <td className="py-3 pr-4 max-w-[200px] truncate font-medium">
                  <Link href={`/fic/${f.id}`} target="_blank" className="hover:text-primary-glow transition">{f.title}</Link>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{f.author}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                    f.status === "complete" ? "bg-emerald-500/15 text-emerald-300" :
                    f.status === "in progress" ? "bg-primary/15 text-primary-glow" :
                    "bg-amber-500/15 text-amber-300"
                  }`}>{f.status}</span>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{f.fandoms.join(", ")}</td>
                <td className="py-3 pr-4 text-muted-foreground text-xs">{new Date(f.createdAt).toLocaleDateString()}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  <Link href={`/profile/${f.addedBy.id}`} target="_blank" className="hover:text-primary-glow transition">{f.addedBy.name}</Link>
                </td>
                <td className="py-3 pr-4 flex gap-1">
                  <button onClick={() => openEdit(f)} className="text-muted-foreground hover:text-foreground transition p-1" title="Edit fic" aria-label="Edit fic">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirm({ id: f.id, title: f.title })} className="text-muted-foreground hover:text-destructive transition p-1" title="Delete fic" aria-label="Delete fic">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        title="Delete fic?"
        description={confirm ? `Delete "${confirm.title}"? This cannot be undone.` : ""}
        isLoading={deleteFic.isPending}
        onConfirm={handleDelete}
      />

      <Dialog open={!!editingFic} onOpenChange={(o) => { if (!o) setEditingFic(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit fanfic</DialogTitle>
            <DialogDescription>Update fic metadata and tags.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                <Input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className="h-8 text-sm bg-surface border-border" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Author</label>
                <Input value={editForm.author} onChange={(e) => setEditForm((p) => ({ ...p, author: e.target.value }))} className="h-8 text-sm bg-surface border-border" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-lg border border-border bg-surface p-2 text-sm resize-none h-20" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} className="w-full rounded-lg border border-border bg-surface p-2 text-sm">
                  <option value="in progress">In Progress</option>
                  <option value="complete">Complete</option>
                  <option value="on hiatus">On Hiatus</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Language</label>
                <Input value={editForm.language} onChange={(e) => setEditForm((p) => ({ ...p, language: e.target.value }))} className="h-8 text-sm bg-surface border-border" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Words</label>
                <Input type="number" value={editForm.words} onChange={(e) => setEditForm((p) => ({ ...p, words: e.target.value }))} className="h-8 text-sm bg-surface border-border" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Chapters</label>
                <Input type="number" value={editForm.chapters} onChange={(e) => setEditForm((p) => ({ ...p, chapters: e.target.value }))} className="h-8 text-sm bg-surface border-border" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editForm.mature} onChange={(e) => setEditForm((p) => ({ ...p, mature: e.target.checked }))} className="h-4 w-4 accent-destructive" />
                  Mature
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Link</label>
              <Input value={editForm.link} onChange={(e) => setEditForm((p) => ({ ...p, link: e.target.value }))} className="h-8 text-sm bg-surface border-border" placeholder="https://…" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tags (comma separated)</label>
              <Input value={editForm.tags} onChange={(e) => setEditForm((p) => ({ ...p, tags: e.target.value }))} className="h-8 text-sm bg-surface border-border" placeholder="Alternate Universe, Slow Burn" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fandoms (comma separated)</label>
              <Input value={editForm.fandoms} onChange={(e) => setEditForm((p) => ({ ...p, fandoms: e.target.value }))} className="h-8 text-sm bg-surface border-border" placeholder="Harry Potter, Marvel" />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditingFic(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateFic.isPending}>
              {updateFic.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
