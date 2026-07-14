"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Edit3, ChevronLeft, ChevronRight, X, Check, Tags } from "lucide-react";
import { toast } from "sonner";
import { useAdminTags, useCreateTag, useRenameTag, useDeleteTag, useMergeTags } from "@/hooks/use-admin";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ConfirmModal } from "@/components/confirm-modal";

export default function TagsSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const { data, isLoading } = useAdminTags(page, q);
  const createTag = useCreateTag();
  const renameTag = useRenameTag();
  const deleteTag = useDeleteTag();
  const mergeTags = useMergeTags();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [mergeOpen, setMergeOpen] = useState(false);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");

  const handleSearch = () => { setQ(search); setPage(1); };

  const handleCreate = () => {
    if (!createName.trim()) return;
    createTag.mutate(createName.trim(), {
      onSuccess: () => { setCreateDialogOpen(false); setCreateName(""); toast.success("Tag created"); },
      onError: (e: any) => toast.error(e.message || "Failed to create tag"),
    });
  };

  const handleRename = (id: string) => {
    if (!editValue.trim()) return;
    renameTag.mutate({ id, name: editValue.trim() }, {
      onSuccess: () => { setEditingId(null); toast.success("Tag renamed"); },
      onError: (e: any) => toast.error(e.message || "Failed to rename"),
    });
  };

  const handleDelete = () => {
    if (!confirm) return;
    const { id, name } = confirm;
    deleteTag.mutate(id, {
      onSuccess: () => {
        setConfirm(null);
        toast("Tag deleted", {
          action: { label: "Undo", onClick: () => createTag.mutate(name) },
          duration: 5000,
        });
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  const handleMerge = () => {
    if (!sourceId || !targetId || sourceId === targetId) { toast.error("Select two different tags"); return; }
    mergeTags.mutate({ sourceId, targetId }, {
      onSuccess: () => { setMergeOpen(false); setSourceId(""); setTargetId(""); toast.success("Tags merged"); },
      onError: () => toast.error("Failed to merge"),
    });
  };

  const source = data?.data.find((t) => t.id === sourceId);
  const target = data?.data.find((t) => t.id === targetId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search tags…"
            className="pl-9 bg-surface border-border"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)} className="border-border shrink-0">
          New tag
        </Button>
        <Button variant="outline" size="sm" onClick={() => setMergeOpen(true)} className="border-border shrink-0">
          Merge
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Fics</th>
              <th className="pb-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} className="py-10"><TableSkeleton cols={3} rows={5} /></td></tr>
            ) : !data?.data.length ? (
              <tr><td colSpan={3} className="py-10"><EmptyState icon={Tags} title="No tags found." /></td></tr>
            ) : data.data.map((t) => (
              <tr key={t.id} className="border-b border-border/50">
                <td className="py-3 pr-4">
                  {editingId === t.id ? (
                    <div className="flex gap-1">
                      <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleRename(t.id)} className="h-8 text-sm bg-surface border-border" autoFocus />
                      <Button size="sm" variant="ghost" onClick={() => handleRename(t.id)} className="h-8" aria-label="Confirm rename"><Check className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8" aria-label="Cancel rename"><X className="h-3.5 w-3.5" /></Button>
                    </div>
                  ) : (
                    <span>{t.name}</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{t.fanficCount}</td>
                <td className="py-3 pr-4 flex gap-1">
                  <button onClick={() => { setEditingId(t.id); setEditValue(t.name); }} className="text-muted-foreground hover:text-foreground transition p-1" title="Rename" aria-label="Rename tag">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => {
                    if (t.fanficCount > 0) { toast.error(`Tag "${t.name}" is used by ${t.fanficCount} fics`); return; }
                    setConfirm({ id: t.id, name: t.name });
                  }} className="text-muted-foreground hover:text-destructive transition p-1" title="Delete" aria-label="Delete tag">
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

      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge tags</DialogTitle>
            <DialogDescription>Move all fics from source to target, then delete source.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Source (will be deleted)</label>
              <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className="w-full rounded-lg border border-border bg-surface p-2 text-sm">
                <option value="">Select tag…</option>
                {data?.data.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.fanficCount} fics)</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Target (will receive fics)</label>
              <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="w-full rounded-lg border border-border bg-surface p-2 text-sm">
                <option value="">Select tag…</option>
                {data?.data.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.fanficCount} fics)</option>)}
              </select>
            </div>
            {source && target && (
              <div className="text-xs text-muted-foreground bg-surface-2 p-3 rounded-lg">
                {source.name} ({source.fanficCount} fics) → {target.name} ({target.fanficCount + source.fanficCount} fics)
              </div>
            )}
            <Button className="w-full" onClick={handleMerge} disabled={!sourceId || !targetId || mergeTags.isPending}>
              {mergeTags.isPending ? "Merging…" : "Merge"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create tag</DialogTitle>
            <DialogDescription>Add a new tag to the catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Tag name"
              className="bg-surface border-border"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setCreateDialogOpen(false); setCreateName(""); }}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!createName.trim() || createTag.isPending}>
                {createTag.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!confirm}
        onOpenChange={(o) => { if (!o) setConfirm(null); }}
        title="Delete tag?"
        description={confirm ? `Delete "${confirm.name}"?` : ""}
        isLoading={deleteTag.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
