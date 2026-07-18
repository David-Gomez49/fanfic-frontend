"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { ConfirmModal } from "@/shared/components/common/confirm-modal";
import { TableSkeleton } from "@/features/admin/components/table-skeleton";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Search, Trash2, Edit3, ChevronLeft, ChevronRight, X, Check, Globe } from "lucide-react";
import { toast } from "sonner";
import { useAdminFandoms, useCreateFandom, useRenameFandom, useDeleteFandom, useMergeFandoms } from "@/features/admin/hooks";

export default function FandomsSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const { data, isLoading } = useAdminFandoms(page, q);
  const createFandom = useCreateFandom();
  const renameFandom = useRenameFandom();
  const deleteFandom = useDeleteFandom();
  const mergeFandoms = useMergeFandoms();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [mergeOpen, setMergeOpen] = useState(false);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createName, setCreateName] = useState("");

  const handleSearch = () => { setQ(search); setPage(1); };

  const handleCreate = () => {
    if (!createName.trim()) return;
    createFandom.mutate(createName.trim(), {
      onSuccess: () => { setCreateDialogOpen(false); setCreateName(""); toast.success("Fandom created"); },
      onError: (e: any) => toast.error(e.message || "Failed to create fandom"),
    });
  };

  const handleRename = (id: string) => {
    if (!editValue.trim()) return;
    renameFandom.mutate({ id, name: editValue.trim() }, {
      onSuccess: () => { setEditingId(null); toast.success("Fandom renamed"); },
      onError: (e: any) => toast.error(e.message || "Failed to rename"),
    });
  };

  const handleDelete = () => {
    if (!confirm) return;
    const { id, name } = confirm;
    deleteFandom.mutate(id, {
      onSuccess: () => {
        setConfirm(null);
        toast("Fandom deleted", {
          action: { label: "Undo", onClick: () => createFandom.mutate(name) },
          duration: 5000,
        });
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  const handleMerge = () => {
    if (!sourceId || !targetId || sourceId === targetId) { toast.error("Select two different fandoms"); return; }
    mergeFandoms.mutate({ sourceId, targetId }, {
      onSuccess: () => { setMergeOpen(false); setSourceId(""); setTargetId(""); toast.success("Fandoms merged"); },
      onError: () => toast.error("Failed to merge"),
    });
  };

  const source = data?.data.find((f) => f.id === sourceId);
  const target = data?.data.find((f) => f.id === targetId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search fandoms…"
            className="pl-9 bg-surface border-border"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)} className="border-border shrink-0">
          New fandom
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
              <th className="pb-3 pr-4">Aliases</th>
              <th className="pb-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="py-10"><TableSkeleton cols={4} rows={5} /></td></tr>
            ) : !data?.data.length ? (
              <tr><td colSpan={4} className="py-10"><EmptyState icon={Globe} title="No fandoms found." /></td></tr>
            ) : data.data.map((f) => (
              <tr key={f.id} className="border-b border-border/50">
                <td className="py-3 pr-4">
                  {editingId === f.id ? (
                    <div className="flex gap-1">
                      <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleRename(f.id)} className="h-8 text-sm bg-surface border-border" autoFocus />
                      <Button size="sm" variant="ghost" onClick={() => handleRename(f.id)} className="h-8" aria-label="Confirm rename"><Check className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8" aria-label="Cancel rename"><X className="h-3.5 w-3.5" /></Button>
                    </div>
                  ) : (
                    <span className="font-medium">{f.name}</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{f.fanficCount}</td>
                <td className="py-3 pr-4 text-muted-foreground text-xs">{f.aliases.length > 0 ? f.aliases.join(", ") : "—"}</td>
                <td className="py-3 pr-4 flex gap-1">
                  <button onClick={() => { setEditingId(f.id); setEditValue(f.name); }} className="text-muted-foreground hover:text-foreground transition p-1" title="Rename" aria-label="Rename fandom">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => {
                    if (f.fanficCount > 0) { toast.error(`Fandom "${f.name}" is used by ${f.fanficCount} fics`); return; }
                    setConfirm({ id: f.id, name: f.name });
                  }} className="text-muted-foreground hover:text-destructive transition p-1" title="Delete" aria-label="Delete fandom">
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

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create fandom</DialogTitle>
            <DialogDescription>Add a new fandom to the catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Fandom name"
              className="bg-surface border-border"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setCreateDialogOpen(false); setCreateName(""); }}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!createName.trim() || createFandom.isPending}>
                {createFandom.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge fandoms</DialogTitle>
            <DialogDescription>Move all fics from source to target, then delete source.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Source (will be deleted)</label>
              <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className="w-full rounded-lg border border-border bg-surface p-2 text-sm">
                <option value="">Select fandom…</option>
                {data?.data.map((f) => <option key={f.id} value={f.id}>{f.name} ({f.fanficCount} fics)</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Target (will receive fics)</label>
              <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="w-full rounded-lg border border-border bg-surface p-2 text-sm">
                <option value="">Select fandom…</option>
                {data?.data.map((f) => <option key={f.id} value={f.id}>{f.name} ({f.fanficCount} fics)</option>)}
              </select>
            </div>
            {source && target && (
              <div className="text-xs text-muted-foreground bg-surface-2 p-3 rounded-lg">
                {source.name} ({source.fanficCount} fics) → {target.name} ({target.fanficCount + source.fanficCount} fics)
              </div>
            )}
            <Button className="w-full" onClick={handleMerge} disabled={!sourceId || !targetId || mergeFandoms.isPending}>
              {mergeFandoms.isPending ? "Merging…" : "Merge"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!confirm}
        onOpenChange={(o) => { if (!o) setConfirm(null); }}
        title="Delete fandom?"
        description={confirm ? `Delete "${confirm.name}"?` : ""}
        isLoading={deleteFandom.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
