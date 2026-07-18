"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
const DashboardSection = dynamic(() => import('@/features/admin/components/dashboard-section'), { ssr: false });
const UsersSection = dynamic(() => import('@/features/admin/components/users-section'), { ssr: false });
const FicsSection = dynamic(() => import('@/features/admin/components/fics-section'), { ssr: false });
const CommentsSection = dynamic(() => import('@/features/admin/components/comments-section'), { ssr: false });
const TagsSection = dynamic(() => import('@/features/admin/components/tags-section'), { ssr: false });
const FandomsSection = dynamic(() => import('@/features/admin/components/fandoms-section'), { ssr: false });
const FeedbackSection = dynamic(() => import('@/features/admin/components/feedback-section'), { ssr: false });

import {
  LayoutDashboard, Users, BookOpen, MessageCircle, Tags, Folders, ShieldCheck, MessageSquarePlus,
} from "lucide-react";
import { usePageTitle } from "@/shared/hooks/use-page-title";
import { useAuth } from "@/features/auth";
import { Breadcrumbs } from "@/shared/components/common/breadcrumbs";
import type { AdminTab } from "@/features/admin/types";

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { id: "fics", label: "Fics", icon: <BookOpen className="h-4 w-4" /> },
  { id: "comments", label: "Comments", icon: <MessageCircle className="h-4 w-4" /> },
  { id: "tags", label: "Tags", icon: <Tags className="h-4 w-4" /> },
  { id: "fandoms", label: "Fandoms", icon: <Folders className="h-4 w-4" /> },
  { id: "feedback", label: "Feedback", icon: <MessageSquarePlus className="h-4 w-4" /> },
];

function AdminPageContent() {
  usePageTitle("Admin");
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as AdminTab | null;
  const [tab, setTabState] = useState<AdminTab>(tabParam ?? "dashboard");

  const setTab = useCallback((t: AdminTab) => {
    setTabState(t);
    router.replace(`/admin?tab=${t}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setTabState(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!user || !user.isAdmin) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Access denied.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Breadcrumbs items={[
        { label: "Admin" },
      ]} />
      <div className="flex items-center gap-3 mb-8">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/20 text-destructive">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-3xl">Admin</h1>
          <p className="text-xs text-muted-foreground">@{user.name}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              tab === t.id ? "bg-destructive/15 text-destructive" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <DashboardSection onNavigate={setTab} />}
      {tab === "users" && <UsersSection />}
      {tab === "fics" && <FicsSection />}
      {tab === "comments" && <CommentsSection />}
      {tab === "tags" && <TagsSection />}
      {tab === "fandoms" && <FandomsSection />}
      {tab === "feedback" && <FeedbackSection />}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="h-24 rounded-xl bg-surface-2 animate-pulse" /></div>}>
      <AdminPageContent />
    </Suspense>
  );
}
