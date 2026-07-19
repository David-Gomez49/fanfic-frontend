"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Search, X, LayoutGrid, List, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Infinity as InfinityIcon, SearchX } from "lucide-react";
import { usePageTitle } from "@/shared/hooks/use-page-title";
import { useFics, useTagSuggestions, useFandomAutocomplete } from "@/features/fics/hooks";
import { FicCard } from "@/shared/components/common/fic-card";
import { FicCardList } from "@/shared/components/common/fic-card-list";
import { FicCardSkeleton, FicCardListSkeleton } from "@/shared/components/common/fic-card-skeleton";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shared/components/ui/collapsible";
import { Breadcrumbs } from "@/shared/components/common/breadcrumbs";
import { EmptyState } from "@/shared/components/common/empty-state";
import { useDebounce } from "@/shared/hooks/use-debounce";

type Sort = "popular" | "rating" | "recent" | "best";
type Maturity = "all" | "general" | "mature";
type ViewMode = "grid" | "list";

const ALL_TAGS = [
  "romance", "angst", "fluff", "AU", "slow burn", "enemies to lovers",
  "friends to lovers", "dark", "hurt/comfort", "fix it", "smut", "drama",
  "fantasy", "sci-fi", "mystery", "comedy", "tragedy", "wolfstar", "dramione",
  "destiel", "marauders", "epistolary", "domestic", "coming of age", "gothic",
  "vampires", "magical realism", "wlw", "mlm", "historical AU",
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "complete", label: "Complete" },
  { value: "in progress", label: "In progress" },
  { value: "paused", label: "Paused" },
  { value: "abandoned", label: "Abandoned" },
];

const MATURITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "mature", label: "Mature" },
];

const WORD_COUNT_MAP = [0, 1000, 5000, 10000, 50000, 100000, Infinity];
const WORD_COUNT_LABELS = ["Any", "1k+", "5k+", "10k+", "50k+", "100k+"];

export default function BrowsePage() {
  usePageTitle("Browse");

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [q, setQ] = useState("");
  const [includeTags, setIncludeTags] = useState<string[]>([]);
  const [excludeTags, setExcludeTags] = useState<string[]>([]);
  const [status, setStatus] = useState("all");
  const [maturity, setMaturity] = useState<Maturity>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [wordCountIdx, setWordCountIdx] = useState(0);
  const [fandoms, setFandoms] = useState<string[]>([]);
  const [excludeFandoms, setExcludeFandoms] = useState<string[]>([]);
  const [crossover, setCrossover] = useState<"all" | "crossover" | "single">("all");
  const [page, setPage] = useState(1);
  const [infiniteScroll, setInfiniteScroll] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [fandomInput, setFandomInput] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagSuggestionIdx, setTagSuggestionIdx] = useState(-1);
  const [fandomSuggestionIdx, setFandomSuggestionIdx] = useState(-1);
  const tagSuggestionsRef = useRef<HTMLDivElement>(null);
  const fandomSuggestionsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedQ = useDebounce(q, 300);
  const debouncedTags = useDebounce(includeTags, 300);
  const debouncedFandoms = useDebounce(fandoms, 300);

  const minWords = WORD_COUNT_MAP[wordCountIdx] ?? 0;

  const { data: response, isLoading } = useFics({
    search: debouncedQ,
    sort,
    tags: debouncedTags,
    excludeTags,
    fandoms: debouncedFandoms,
    excludeFandoms,
    status,
    mature: maturity,
    crossover,
    minWords,
    page,
  });
  const fics = response?.data ?? [];

  const debouncedTagInput = useDebounce(tagInput, 200);
  const debouncedFandomInput = useDebounce(fandomInput, 200);

  const { data: apiTagSuggestions = [] } = useTagSuggestions(debouncedTagInput);
  const { data: apiFandomAutocomplete = [] } = useFandomAutocomplete(debouncedFandomInput);

  const tagSuggestions = useMemo(() => {
    if (!debouncedTagInput.trim()) return [];
    return apiTagSuggestions
      .filter((t) => !includeTags.includes(t.name) && !excludeTags.includes(t.name))
      .slice(0, 10);
  }, [apiTagSuggestions, includeTags, excludeTags, debouncedTagInput]);

  const fandomSuggestions = useMemo(() => {
    if (!debouncedFandomInput.trim()) return [];
    return apiFandomAutocomplete
      .filter((f) => !fandoms.includes(f.name) && !excludeFandoms.includes(f.name))
      .slice(0, 10);
  }, [apiFandomAutocomplete, fandoms, excludeFandoms, debouncedFandomInput]);

  const availableTags = useMemo(() => response?.availableTags ?? [], [response]);
  const availableFandoms = useMemo(() => response?.availableFandoms ?? [], [response]);

  const toggleInclude = (t: string) => {
    setIncludeTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
    setExcludeTags((cur) => cur.filter((x) => x !== t));
  };

  const toggleExclude = (t: string) => {
    setExcludeTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
    setIncludeTags((cur) => cur.filter((x) => x !== t));
  };

  const toggleIncludeFandom = (f: string) => {
    setFandoms((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
    setExcludeFandoms((cur) => cur.filter((x) => x !== f));
  };

  const toggleExcludeFandom = (f: string) => {
    setExcludeFandoms((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
    setFandoms((cur) => cur.filter((x) => x !== f));
  };

  const displayTags = useMemo(() => {
    const count = new Map(availableTags.map((t) => [t.name, t.count]));
    const sorted = [...count.entries()].sort((a, b) => b[1] - a[1]);
    const set = new Set(sorted.slice(0, 12).map(([n]) => n));
    if (set.size === 0) {
      ALL_TAGS.slice(0, 12).forEach((t) => set.add(t));
    }
    tagSuggestions.forEach((t) => set.add(t.name));
    includeTags.forEach((t) => set.add(t));
    excludeTags.forEach((t) => set.add(t));
    return [...set].slice(0, 20).map((name) => ({ name, count: count.get(name) ?? 0 }));
  }, [availableTags, tagSuggestions, includeTags, excludeTags]);

  const fandomCounts = useMemo(() => {
    return new Map(availableFandoms.map((f) => [f.name, f.count]));
  }, [availableFandoms]);

  useEffect(() => { setPage(1); }, [debouncedQ, sort, debouncedTags, debouncedFandoms, status, maturity, crossover, wordCountIdx, includeTags, excludeTags, fandoms, excludeFandoms]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setTagSuggestionIdx((i) => Math.min(i + 1, tagSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setTagSuggestionIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && tagSuggestionIdx >= 0 && tagSuggestions[tagSuggestionIdx]) {
      e.preventDefault();
      toggleInclude(tagSuggestions[tagSuggestionIdx].name);
      setTagInput("");
      setTagSuggestionIdx(-1);
    }
  };

  useEffect(() => {
    setTagSuggestionIdx(-1);
  }, [tagSuggestions]);

  const handleFandomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFandomSuggestionIdx((i) => Math.min(i + 1, fandomSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFandomSuggestionIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && fandomSuggestionIdx >= 0 && fandomSuggestions[fandomSuggestionIdx]) {
      e.preventDefault();
      toggleIncludeFandom(fandomSuggestions[fandomSuggestionIdx].name);
      setFandomInput("");
      setFandomSuggestionIdx(-1);
    }
  };

  useEffect(() => {
    setFandomSuggestionIdx(-1);
  }, [fandomSuggestions]);

  const filterItems = (
    <>
      <FilterGroup label="Status">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-surface border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterGroup>

      <FilterGroup label="Maturity">
        <div className="flex rounded-lg border border-border overflow-hidden text-xs">
          {MATURITY_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setMaturity(o.value as Maturity)}
              className={`flex-1 py-2 transition ${
                maturity === o.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:text-foreground"
              } ${o.value !== "all" ? "border-l border-border" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Crossover">
        <div className="flex rounded-lg border border-border overflow-hidden text-xs">
          {[
            { value: "all", label: "All" },
            { value: "crossover", label: "Crossovers" },
            { value: "single", label: "Single fandom" },
          ].map((o) => (
            <button
              key={o.value}
              onClick={() => setCrossover(o.value as "all" | "crossover" | "single")}
              className={`flex-1 py-2 transition ${
                crossover === o.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:text-foreground"
              } ${o.value !== "all" ? "border-l border-border" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Tags">
        <div className="relative">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim() && tagSuggestionIdx < 0) {
                toggleInclude(tagInput.trim().toLowerCase());
                setTagInput("");
              } else {
                handleTagKeyDown(e);
              }
            }}
            placeholder="Search tag…"
            className="bg-surface border-border text-sm"
            aria-autocomplete="list"
            aria-controls="tag-suggestions"
            aria-activedescendant={tagSuggestionIdx >= 0 ? `tag-suggestion-${tagSuggestionIdx}` : undefined}
          />
          {tagSuggestions.length > 0 && (
            <div
              ref={tagSuggestionsRef}
              id="tag-suggestions"
              role="listbox"
              className="absolute top-full mt-1 left-0 right-0 z-10 bg-card border border-border rounded-lg p-1 shadow-lg"
            >
              {tagSuggestions.map((s, i) => (
                <button
                  key={s.name}
                  id={`tag-suggestion-${i}`}
                  role="option"
                  aria-selected={tagSuggestionIdx === i}
                  onClick={() => { toggleInclude(s.name); setTagInput(""); setTagSuggestionIdx(-1); }}
                  onMouseEnter={() => setTagSuggestionIdx(i)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition ${
                    tagSuggestionIdx === i ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-xs opacity-60">{s.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {displayTags.map(({ name, count }) => {
            const isIn = includeTags.includes(name);
            const isEx = excludeTags.includes(name);
            return (
              <div key={name} className={`flex rounded-full overflow-hidden border text-xs ${
                isEx ? "border-destructive bg-destructive text-destructive-foreground" :
                isIn ? "border-primary bg-primary text-primary-foreground" :
                "border-border/60 bg-surface text-muted-foreground"
              }`}>
                <button
                  onClick={() => toggleInclude(name)}
                  className={`px-2 py-1 transition hover:opacity-80 ${isEx ? "line-through" : ""}`}
                  title={isEx ? "Remove exclusion" : isIn ? "Remove from included" : "Include tag"}
                >
                  {name} <span className="opacity-60">({count})</span>
                </button>
                  <button
                    onClick={() => toggleExclude(name)}
                    className={`px-1.5 py-1 border-l transition hover:opacity-80 ${
                      isEx ? "border-destructive-foreground/20" :
                      isIn ? "border-primary-foreground/20" :
                      "border-border/60"
                    }`}
                    title={isEx ? "Remove exclusion" : "Exclude tag"}
                    aria-label={isEx ? "Remove exclusion" : "Exclude tag"}
                  >
                    <X className="h-3 w-3" />
                  </button>
              </div>
            );
          })}
        </div>

        {(includeTags.length > 0 || excludeTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 text-xs"
            onClick={() => { setIncludeTags([]); setExcludeTags([]); }}
          >
            <X className="h-3 w-3 mr-1" /> Clear filters
          </Button>
        )}
      </FilterGroup>

      <FilterGroup label="Fandoms">
        <div className="relative">
          <Input
            value={fandomInput}
            onChange={(e) => setFandomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && fandomInput.trim() && fandomSuggestionIdx < 0) {
                toggleIncludeFandom(fandomInput.trim().toLowerCase());
                setFandomInput("");
              } else {
                handleFandomKeyDown(e);
              }
            }}
            placeholder="Search fandom…"
            className="bg-surface border-border text-sm"
          />
          {fandomSuggestions.length > 0 && (
            <div
              ref={fandomSuggestionsRef}
              role="listbox"
              className="absolute top-full mt-1 left-0 right-0 z-10 bg-card border border-border rounded-lg p-1 shadow-lg"
            >
              {fandomSuggestions.map((s, i) => (
                <button
                  key={s.name}
                  role="option"
                  aria-selected={fandomSuggestionIdx === i}
                  onClick={() => { toggleIncludeFandom(s.name); setFandomInput(""); setFandomSuggestionIdx(-1); }}
                  onMouseEnter={() => setFandomSuggestionIdx(i)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition ${
                    fandomSuggestionIdx === i ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-xs opacity-60">{s.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {availableFandoms.map((fnd) => {
            const isIn = fandoms.includes(fnd.name);
            const isEx = excludeFandoms.includes(fnd.name);
            const count = fandomCounts.get(fnd.name) ?? 0;
            return (
              <div key={fnd.name} className={`flex rounded-full overflow-hidden border text-xs ${
                isEx ? "border-destructive bg-destructive text-destructive-foreground" :
                isIn ? "border-primary bg-primary text-primary-foreground" :
                "border-border/60 bg-surface text-muted-foreground"
              }`}>
                <button
                  onClick={() => toggleIncludeFandom(fnd.name)}
                  className={`px-2 py-1 transition hover:opacity-80 ${isEx ? "line-through" : ""}`}
                  title={isIn ? "Remove from included" : "Include"}
                >
                  {fnd.name} <span className="opacity-60">({count})</span>
                </button>
                  <button
                    onClick={() => toggleExcludeFandom(fnd.name)}
                    className={`px-1.5 py-1 border-l transition hover:opacity-80 ${
                      isEx ? "border-destructive-foreground/20" :
                      isIn ? "border-primary-foreground/20" :
                      "border-border/60"
                    }`}
                    title={isEx ? "Remove exclusion" : "Exclude"}
                    aria-label={isEx ? "Remove exclusion" : "Exclude fandom"}
                  >
                    <X className="h-3 w-3" />
                  </button>
              </div>
            );
          })}
          {availableFandoms.length === 0 && (
            <p className="text-xs text-muted-foreground">No fandoms available</p>
          )}
        </div>
        {(fandoms.length > 0 || excludeFandoms.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 text-xs"
            onClick={() => { setFandoms([]); setExcludeFandoms([]); }}
          >
            <X className="h-3 w-3 mr-1" /> Clear fandoms
          </Button>
        )}
      </FilterGroup>

      <FilterGroup label="Words">
        <input
          type="range"
          min={0}
          max={5}
          value={wordCountIdx}
          onChange={(e) => setWordCountIdx(Number(e.target.value))}
          className="accent-primary w-full h-1 bg-surface-2 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground font-mono mt-1">
          <span>Any</span>
          <span>{WORD_COUNT_LABELS[wordCountIdx]}</span>
        </div>
      </FilterGroup>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Browse" }]} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Browse</h1>
          <p className="text-muted-foreground mt-2">{response?.total ?? 0} fanfictions found</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Grid view"
              title="Grid"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="List view"
              title="List"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setInfiniteScroll((v) => !v)}
            className={`p-2 rounded-lg border transition ${
              infiniteScroll ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
            aria-label={infiniteScroll ? "Disable infinite scroll" : "Enable infinite scroll"}
            title={infiniteScroll ? "Infinite scroll on" : "Infinite scroll off"}
          >
            <InfinityIcon className="h-4 w-4" />
          </button>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="w-40 bg-surface border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popularity</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="best">Best</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Title, author, fandom…"
              className="pl-9 bg-surface border-border"
            />
          </div>

          <div className="lg:hidden">
            <Collapsible open={filterOpen} onOpenChange={setFilterOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="w-full border-border bg-surface justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                  </span>
                  <ChevronDown className={`h-4 w-4 transition ${filterOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 mt-4">
                {filterItems}
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="hidden lg:block space-y-6">
            {filterItems}
          </div>
        </aside>

        <div>
          {isLoading ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <FicCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => <FicCardListSkeleton key={i} />)}
              </div>
            )
          ) : fics.length === 0 ? (
            <EmptyState icon={SearchX} title="No results" description="Try changing filters." />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {fics.map((f, i) => <FicCard key={f.id} fic={f} highlight={debouncedQ} style={{ animation: "fade-in-up 0.4s ease-out both", animationDelay: `${i * 50}ms` }} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {fics.map((f, i) => <FicCardList key={f.id} fic={f} highlight={debouncedQ} style={{ animation: "fade-in-up 0.4s ease-out both", animationDelay: `${i * 50}ms` }} />)}
            </div>
          )}

          {response && response.totalPages > 1 && (
            infiniteScroll ? (
              page < response.totalPages && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} className="border-border" disabled={isLoading}>
                    {isLoading ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border-border" aria-label="Previous page">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(response.totalPages, 7) }, (_, i) => {
                    const p = (() => {
                      const total = response.totalPages;
                      if (total <= 7) return i + 1;
                      if (page <= 4) return i + 1;
                      if (page >= total - 3) return total - 6 + i;
                      return page - 3 + i;
                    })();
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                          p === page
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                        }`}
                        aria-label={`Page ${p}`}
                        aria-current={p === page ? "page" : undefined}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <Button variant="outline" size="sm" disabled={page >= response.totalPages} onClick={() => setPage((p) => p + 1)} className="border-border" aria-label="Next page">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground ml-2">
                  {response.total} fics
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
      {children}
    </div>
  );
}
