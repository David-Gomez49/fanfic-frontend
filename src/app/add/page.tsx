"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Link2, X, Plus, Loader2 } from "lucide-react";
import { usePageTitle } from "@/lib/use-page-title";
import { useAddFic, useScrape, useTagSuggestions, useFandomSuggestions } from "@/hooks/use-fics";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  link: z.string().url().optional().or(z.literal("")),
  title: z.string().trim().min(1, "Required").max(200),
  author: z.string().trim().min(1, "Required").max(100),
  description: z.string().trim().min(10, "Minimum 10 characters").max(2000),
  fandoms: z.array(z.string().trim().min(1).max(100)).min(1, "Add at least one fandom").max(5),
  language: z.string().trim().min(1),
  status: z.enum(["complete", "in progress", "paused", "abandoned"]),
  words: z.coerce.number().int().nonnegative("Must be 0 or more").optional().or(z.literal("")),
  chapters: z.coerce.number().int().positive("Must be at least 1").optional().or(z.literal("")),
});

export default function AddFic() {
  usePageTitle("Add fanfiction");
  const router = useRouter();
  const { user } = useAuth();
  const addFic = useAddFic();
  const scrape = useScrape();
  const [form, setForm] = useState({
    link: "", title: "", author: "", description: "",
    language: "", status: "", words: "", chapters: "",
  });
  const [fandoms, setFandoms] = useState<string[]>([]);
  const [fandomInput, setFandomInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [mature, setMature] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fandomSuggestOpen, setFandomSuggestOpen] = useState(false);

  const { data: tagSuggestions = [] } = useTagSuggestions(tagInput);
  const { data: fandomSuggestions = [] } = useFandomSuggestions(fandomInput);

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const clearError = (k: string) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });

  const addFandom = (f: string) => {
    const fnd = f.trim();
    if (!fnd || fandoms.includes(fnd) || fandoms.length >= 5) return;
    setFandoms([...fandoms, fnd]);
    setFandomInput("");
    setFandomSuggestOpen(false);
  };

  const addTag = (t: string) => {
    const tag = t.trim().toLowerCase();
    if (!tag || tags.includes(tag) || tags.length >= 15) return;
    setTags([...tags, tag]);
    setTagInput("");
  };

  const tryAutofill = async () => {
    if (!form.link) {
      toast.error("Paste a link first");
      return;
    }
    try {
      const result = await scrape.mutateAsync(form.link);
      setForm((f) => ({
        ...f,
        title: result.title || f.title,
        author: result.author || f.author,
        description: result.description || f.description,
        language: result.language || f.language,
        status: result.status || f.status,
        words: result.words != null ? String(result.words) : f.words,
        chapters: result.chapters != null ? String(result.chapters) : f.chapters,
      }));
      if (result.fandoms?.length) setFandoms(result.fandoms);
      if (result.tags) setTags(result.tags);
      if (result.mature !== undefined) setMature(result.mature);
      toast.success("Data autofilled from link");
    } catch {
      toast.error("Could not extract information from link");
    }
  };

  const submit = async () => {
    if (!user) { toast.error("You need to sign in first"); return; }
    const errs: Record<string, string> = {};
    if (!form.language) errs.language = "Select a language";
    if (!form.status) errs.status = "Select a status";
    const validation = { ...form, fandoms };
    const parsed = schema.safeParse(validation);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!errs[key]) errs[key] = issue.message;
      }
    }
    if (tags.length === 0) errs.tags = "Add at least one tag";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      const { words, chapters, ...rest } = parsed.data!;
      const fic = await addFic.mutateAsync({
        ...rest,
        tags,
        mature,
        words: words ? Number(words) : undefined,
        chapters: chapters ? Number(chapters) : undefined,
      });
      toast.success("Fanfic added!");
      router.push(`/fic/${fic.id}`);
    } catch (e: any) {
      let msg = "Error adding fanfic";
      try { msg = JSON.parse(e.message).error ?? msg; } catch {}
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl">Add fanfiction</h1>
        <p className="text-muted-foreground mt-2">Share a recommendation with the community.</p>
      </div>

      <div className="space-y-8 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
        <Field label="Link" hint="AO3, Wattpad, FFN… we'll try to autofill.">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={form.link}
                onChange={(e) => update("link", e.target.value)}
                placeholder="https://…"
                className="pl-9 bg-surface border-border"
              />
            </div>
            {form.link && (
              <Button type="button" variant="outline" onClick={tryAutofill} disabled={scrape.isPending} className="border-border">
                {scrape.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Autofill"}
              </Button>
            )}
          </div>
        </Field>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Title" error={errors.title}>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} className={`bg-surface ${errors.title ? "border-destructive" : "border-border"}`} />
          </Field>
          <Field label="Author" error={errors.author}>
            <Input value={form.author} onChange={(e) => update("author", e.target.value)} className={`bg-surface ${errors.author ? "border-destructive" : "border-border"}`} />
          </Field>
        </div>

        <Field label="Description" error={errors.description}>
          <Textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="No spoilers, sell the idea…"
            maxLength={2000}
            className={`bg-surface ${errors.description ? "border-destructive" : "border-border"} min-h-[120px]`}
          />
        </Field>

        <Field label="Fandoms" hint="Up to 5. Press Enter to add." error={errors.fandoms}>
          <div className="flex gap-2 relative">
            <Input
              value={fandomInput}
              onChange={(e) => { clearError("fandoms"); setFandomInput(e.target.value); setFandomSuggestOpen(true); }}
              onFocus={() => setFandomSuggestOpen(true)}
              onBlur={() => setTimeout(() => setFandomSuggestOpen(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addFandom(fandomInput); clearError("fandoms"); }
              }}
              placeholder="Harry Potter"
              className={`bg-surface ${errors.fandoms ? "border-destructive" : "border-border"}`}
            />
            <Button type="button" variant="outline" onClick={() => { addFandom(fandomInput); clearError("fandoms"); }} className="border-border">
              <Plus className="h-4 w-4" />
            </Button>
            {fandomSuggestOpen && fandomSuggestions.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 z-10 bg-card border border-border rounded-lg p-1 shadow-lg">
                {fandomSuggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); addFandom(s.name); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-surface-2 transition flex items-center justify-between"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      s.matchType === "strong" ? "bg-emerald-500/15 text-emerald-300" :
                      s.matchType === "partial" ? "bg-amber-500/15 text-amber-300" :
                      "bg-surface-2 text-muted-foreground"
                    }`}>
                      {s.fanficCount} fic{s.fanficCount !== 1 ? "s" : ""}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {fandoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {fandoms.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                  {f}
                  <button onClick={() => setFandoms(fandoms.filter((x) => x !== f))} className="hover:opacity-80" aria-label={`Remove ${f}`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <Field label="Tags" hint="Up to 15. Press Enter to add." error={errors.tags}>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => { clearError("tags"); setTagInput(e.target.value); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); clearError("tags"); }
              }}
              placeholder="romance, slow burn…"
              className={`bg-surface ${errors.tags ? "border-destructive" : "border-border"}`}
            />
            <Button type="button" variant="outline" onClick={() => { addTag(tagInput); clearError("tags"); }} className="border-border">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {tagSuggestions.length > 0 && !tagInput.startsWith("#") && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1.5">Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {tagSuggestions.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => addTag(s.name)}
                    className={`text-xs px-2.5 py-1 rounded-full transition ${
                      tagSuggestions[0] === s
                        ? "bg-primary/10 text-primary-glow border border-primary/30 hover:bg-primary/20"
                        : "bg-surface-2 border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    + {s.name}{" "}
                    <span className="opacity-60">({s.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                  {t}
                  <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:opacity-80" aria-label={`Remove ${t}`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Language" error={errors.language}>
            <Select value={form.language} onValueChange={(v) => update("language", v)}>
              <SelectTrigger className={`bg-surface ${errors.language ? "border-destructive" : "border-border"}`}><SelectValue placeholder="Select language" /></SelectTrigger>
              <SelectContent>
                {["Spanish", "English", "Portuguese", "French", "Italian", "Japanese", "Korean"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status" error={errors.status}>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className={`bg-surface ${errors.status ? "border-destructive" : "border-border"}`}><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="in progress">In progress</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Words" error={errors.words}>
            <Input
              type="number"
              min={0}
              value={form.words}
              onChange={(e) => update("words", e.target.value)}
              placeholder="e.g. 45000"
              className={`bg-surface ${errors.words ? "border-destructive" : "border-border"}`}
            />
          </Field>
          <Field label="Chapters" error={errors.chapters}>
            <Input
              type="number"
              min={1}
              value={form.chapters}
              onChange={(e) => update("chapters", e.target.value)}
              placeholder="e.g. 24"
              className={`bg-surface ${errors.chapters ? "border-destructive" : "border-border"}`}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
          <div>
            <Label className="text-sm">Adult content (18+)</Label>
            <p className="text-xs text-muted-foreground">Hidden by default in the catalog.</p>
          </div>
          <Switch checked={mature} onCheckedChange={setMature} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => router.push("/browse")}>Cancel</Button>
          <Button onClick={submit} disabled={addFic.isPending} className="bg-gradient-primary shadow-glow">
            {addFic.isPending ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground mt-0.5 mb-2">{hint}</p>}
      {!hint && <div className="mt-2" />}
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
