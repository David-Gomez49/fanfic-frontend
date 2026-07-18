"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Edit3, MessageCircle } from "lucide-react";
import { usePageTitle } from "@/shared/hooks/use-page-title";
import { useAuth } from "@/features/auth";
import { useUserProfile, useUserComments, useUserFavorites, useUserAdded, useReadingList } from "@/features/fics/hooks";
import { useUpdateProfile } from "@/features/auth";
import { FicCard } from "@/shared/components/common/fic-card";
import { FicCardSkeleton } from "@/shared/components/common/fic-card-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Breadcrumbs } from "@/shared/components/common/breadcrumbs";
import { BookOpen, Heart, Bookmark, MessageSquare, BookMarked } from "lucide-react";
import { EmptyState } from "@/shared/components/common/empty-state";
import { toast } from "sonner";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: authUser } = useAuth();
  const updateProfile = useUpdateProfile();

  const { data: profile, isLoading: profileLoading } = useUserProfile(id);
  const { data: favorites, isLoading: favLoading } = useUserFavorites(id);
  const { data: added, isLoading: addedLoading } = useUserAdded(id);
  const { data: comments, isLoading: commentsLoading } = useUserComments(id);
  const { data: myReadingList, isLoading: readingListLoading } = useReadingList();

  const isOwn = authUser?.id === id;
  const handle = profile?.name ?? "reader";
  usePageTitle(`@${handle}`);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(authUser?.name ?? "");
  const [editEmail, setEditEmail] = useState(authUser?.email ?? "");

  const handleSave = async () => {
    if (!editName.trim()) { toast.error("Name cannot be empty"); return; }
    const data: Record<string, string> = { name: editName.trim() };
    if (editEmail.trim()) data.email = editEmail.trim();
    updateProfile.mutate(data, {
      onSuccess: async () => {
        setEditOpen(false);
        toast.success("Profile updated");
      },
      onError: (e: any) => toast.error(e.message || "Failed to update profile"),
    });
  };

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-6 mb-12 animate-pulse">
          <div className="h-24 w-24 rounded-3xl bg-surface-2" />
          <div className="space-y-2">
            <div className="h-8 w-48 rounded bg-surface-2" />
            <div className="h-4 w-36 rounded bg-surface-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <FicCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-display mb-2">User not found</h1>
        <Link href="/browse" className="text-primary-glow hover:underline">Browse the catalog →</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: `@${handle}` },
      ]} />
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
        <div className="h-24 w-24 rounded-3xl bg-gradient-primary shadow-glow grid place-items-center font-display text-4xl text-primary-foreground">
          {handle[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl md:text-5xl">@{handle}</h1>
            {isOwn && (
              <button
                onClick={() => { setEditName(authUser?.name ?? ""); setEditEmail(authUser?.email ?? ""); setEditOpen(true); }}
                className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-lg hover:bg-surface-2"
                title="Edit profile"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            {profile._count.fics} added
            {isOwn && (
              <> · {profile._count.favorites} favorites · {profile._count.readingList} to read</>
            )}
          </p>
        </div>
      </div>

      <Tabs defaultValue={isOwn ? "favorites" : "added"}>
        <TabsList className="bg-surface border border-border">
          {isOwn && (
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />Favorites ({profile._count.favorites})
            </TabsTrigger>
          )}
          {isOwn && (
            <TabsTrigger value="reading">
              <Bookmark className="h-4 w-4 mr-2" />To read ({profile._count.readingList})
            </TabsTrigger>
          )}
          <TabsTrigger value="added">
            <BookOpen className="h-4 w-4 mr-2" />Added ({profile._count.fics})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageCircle className="h-4 w-4 mr-2" />Comments ({profile._count.comments})
          </TabsTrigger>
        </TabsList>

        {isOwn && (
          <TabsContent value="favorites" className="mt-8">
            {favLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => <FicCardSkeleton key={i} />)}
              </div>
            ) : !favorites?.length ? (
              <EmptyState icon={Heart} title="No favorites saved yet." action={{ label: "Browse the catalog", href: "/browse" }} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favorites.map((f) => <FicCard key={f.id} fic={f as any} />)}
              </div>
            )}
          </TabsContent>
        )}

        {isOwn && (
          <TabsContent value="reading" className="mt-8">
            {readingListLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => <FicCardSkeleton key={i} />)}
              </div>
            ) : !myReadingList?.length ? (
              <EmptyState icon={BookMarked} title="No fics saved to read yet." action={{ label: "Browse the catalog", href: "/browse" }} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myReadingList.map((f) => <FicCard key={f.id} fic={f} />)}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="added" className="mt-8">
          {addedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => <FicCardSkeleton key={i} />)}
            </div>
          ) : !added?.length ? (
            <EmptyState icon={BookOpen} title="No fanfics added yet." action={{ label: "Browse the catalog", href: "/browse" }} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {added.map((f: any) => <FicCard key={f.id} fic={f} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments" className="mt-8">
          {commentsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-surface-2 animate-pulse" />
              ))}
            </div>
          ) : !comments?.length ? (
            <EmptyState icon={MessageSquare} title="No comments yet." action={{ label: "Browse the catalog", href: "/browse" }} />
          ) : (
            <div className="space-y-3">
              {comments.map((c: any) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Link href={`/fic/${c.ficId}`} className="text-sm font-medium text-primary-glow hover:underline">
                      {c.fic.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 line-clamp-3">{c.text}</p>
                  <Link
                    href={`/fic/${c.ficId}`}
                    className="text-xs text-muted-foreground hover:text-primary-glow mt-2 inline-block"
                  >
                    View fic →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update your name and email (optional).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-surface border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="bg-surface border-border"
                type="email"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
