"use client";

export const dynamic = "force-dynamic";

import { usePageTitle } from "@/shared/hooks/use-page-title";
import Link from "next/link";
import { Sparkles, TrendingUp, Flame, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useStats, useTrending, useTopRated } from "@/features/fics/hooks";
import { FicCard } from "@/shared/components/common/fic-card";
import { FicCardSkeleton } from "@/shared/components/common/fic-card-skeleton";
import { EmptyState } from "@/shared/components/common/empty-state";

function FicGrid({ items, isLoading }: { items?: { id: string }[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <FicCardSkeleton key={i} />)}
      </div>
    );
  }
  if (!items?.length) {
    return <EmptyState icon={BookOpen} title="No fanfics yet." action={{ label: "Add the first one", href: "/add" }} />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((fic) => (
        <FicCard key={fic.id} fic={fic as any} />
      ))}
    </div>
  );
}

export default function HomePage() {
  usePageTitle();
  const { data: stats } = useStats();
  const trending = useTrending();
  const topRated = useTopRated();
  return (
    <div>
      <section className="relative overflow-hidden bg-hero">
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Your next
              <span className="block bg-gradient-to-r from-primary-glow via-accent to-primary bg-clip-text text-transparent italic">
                literary obsession
              </span>
              is waiting for you.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Discover, tag and share fanfictions from any fandom.
              Honest ratings, real recommendations, real community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
                <Link href="/browse">Browse catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border bg-surface/60">
                <Link href="/add">Add a fic</Link>
              </Button>
            </div>
            <div className="mt-12 flex gap-8 text-sm">
              <div>
                <div className="font-display text-3xl text-primary-glow">{stats?.totalFics ?? "—"}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">fanfics</div>
              </div>
              <div>
                <div className="font-display text-3xl text-primary-glow">{stats?.totalTags ?? "—"}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">tags</div>
              </div>
              <div>
                <div className="font-display text-3xl text-primary-glow">{stats?.totalFandoms ?? "—"}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">fandoms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <SectionHeader
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          title="Trending now"
          subtitle="What the community is reading"
        />
        <FicGrid items={trending.data} isLoading={trending.isLoading} />
      </section>

      <section className="container mx-auto px-4 py-14">
        <SectionHeader
          icon={<TrendingUp className="h-5 w-5 text-primary-glow" />}
          title="Top rated"
          subtitle="The gems that break hearts (in a good way)"
        />
        <FicGrid items={topRated.data} isLoading={topRated.isLoading} />
      </section>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
          {icon} {subtitle}
        </div>
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      </div>
      <Link href="/browse" className="text-sm text-primary-glow hover:underline hidden sm:inline-flex items-center gap-1">
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
