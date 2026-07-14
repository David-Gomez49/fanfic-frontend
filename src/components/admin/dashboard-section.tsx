"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Folders, MessageCircle, Tags, Users } from "lucide-react";
import { toast } from "sonner";
import { useAdminStats } from "@/hooks/use-admin";

export default function DashboardSection({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="h-5 w-5 rounded bg-surface-2" />
            <div className="h-8 w-16 rounded bg-surface-2" />
            <div className="h-3 w-12 rounded bg-surface-2" />
          </div>
        ))}
      </div>
    );
  }

  const cards: { label: string; value: number; icon: React.ReactNode; color: string; tab: any }[] = [
    { label: "Users", value: stats?.totalUsers ?? 0, icon: <Users className="h-5 w-5" />, color: "text-blue-400", tab: "users" },
    { label: "Fanfics", value: stats?.totalFics ?? 0, icon: <BookOpen className="h-5 w-5" />, color: "text-primary-glow", tab: "fics" },
    { label: "Comments", value: stats?.totalComments ?? 0, icon: <MessageCircle className="h-5 w-5" />, color: "text-emerald-400", tab: "comments" },
    { label: "Tags", value: stats?.totalTags ?? 0, icon: <Tags className="h-5 w-5" />, color: "text-amber-400", tab: "tags" },
    { label: "Fandoms", value: stats?.totalFandoms ?? 0, icon: <Folders className="h-5 w-5" />, color: "text-rose-400", tab: "fandoms" },
    { label: "Today", value: stats?.todayFics ?? 0, icon: <BookOpen className="h-5 w-5" />, color: "text-cyan-400", tab: "fics" },
    { label: "This week", value: stats?.recentFics ?? 0, icon: <BookOpen className="h-5 w-5" />, color: "text-violet-400", tab: "fics" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <button
          key={c.label}
          onClick={() => onNavigate(c.tab)}
          className="rounded-2xl border border-border bg-card p-5 shadow-card text-left hover:bg-surface-2/60 transition cursor-pointer"
        >
          <div className={`${c.color} mb-2`}>{c.icon}</div>
          <div className="font-display text-3xl">{c.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
        </button>
      ))}
    </div>
  );
}
