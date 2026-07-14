"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Trash2, ShieldCheck, ShieldX, Edit3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/confirm-modal";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";
import { useAdminUsers, useUpdateUser, useDeleteUser } from "@/hooks/use-admin";
import type { AdminUser } from "@/hooks/use-admin";

export default function UsersSection() {
  const { data: users, isLoading } = useAdminUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{ id: string; name: string | null } | null>(null);

  if (isLoading) return <TableSkeleton cols={7} rows={8} />;

  const toggleAdmin = (id: string, current: boolean) => {
    updateUser.mutate({ id, data: { isAdmin: !current } }, {
      onSuccess: () => toast.success("User updated"),
      onError: () => toast.error("Failed to update user"),
    });
  };

  const handleDelete = () => {
    if (!confirm) return;
    deleteUser.mutate(confirm.id, {
      onSuccess: () => { setConfirm(null); toast("User deleted", { duration: 3000 }); },
      onError: () => toast.error("Failed to delete user"),
    });
  };

  const q = search.toLowerCase();
  const filtered = users?.filter(
    (u) =>
      (u.name ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter users…"
          className="pl-9 bg-surface border-border"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Admin</th>
              <th className="pb-3 pr-4">Fics</th>
              <th className="pb-3 pr-4">Comments</th>
              <th className="pb-3 pr-4">Joined</th>
              <th className="pb-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((u) => (
              <tr key={u.id} className="border-b border-border/50">
                <td className="py-3 pr-4">
                  <Link href={`/profile/${u.id}`} target="_blank" className="hover:text-primary-glow transition">{u.name ?? "—"}</Link>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{u.email ?? "—"}</td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => toggleAdmin(u.id, u.isAdmin)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      u.isAdmin ? "bg-destructive/15 text-destructive" : "bg-surface-2 text-muted-foreground hover:text-foreground"
                    }`}
                    title={u.isAdmin ? "Revoke admin" : "Grant admin"}
                    aria-label={u.isAdmin ? "Revoke admin" : "Grant admin"}
                  >
                    {u.isAdmin ? <ShieldCheck className="h-4 w-4" /> : <ShieldX className="h-4 w-4" />}
                    {u.isAdmin ? "Admin" : "User"}
                  </button>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{u._count.fics}</td>
                <td className="py-3 pr-4 text-muted-foreground">{u._count.comments}</td>
                <td className="py-3 pr-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => setConfirm({ id: u.id, name: u.name })}
                    className="text-muted-foreground hover:text-destructive transition p-1"
                    title="Delete user"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr><td colSpan={7} className="py-10"><EmptyState icon={Users} title="No users match." /></td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!confirm}
        onOpenChange={(o) => { if (!o) setConfirm(null); }}
        title="Delete user?"
        description={confirm ? `Delete "${confirm.name ?? confirm.id}"? This cannot be undone.` : ""}
        isLoading={deleteUser.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
