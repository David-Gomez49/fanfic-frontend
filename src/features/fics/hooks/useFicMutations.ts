"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";
import type { Fanfic } from "../types";

function updateFicInCaches(qc: ReturnType<typeof useQueryClient>, ficId: string, updater: (fic: any) => any) {
  qc.setQueryData(["fic", ficId], (old: any) => (old ? updater(old) : old));
  qc.getQueriesData({ queryKey: ["fics"] }).forEach(([key, cached]) => {
    if (!cached) return;
    if (Array.isArray(cached)) {
      qc.setQueryData(key, (old: any[]) => old?.map((f: any) => (f.id === ficId ? updater(f) : f)));
    } else if (typeof cached === "object" && "data" in (cached as any) && Array.isArray((cached as any).data)) {
      qc.setQueryData(key, (old: any) => {
        if (!old) return old;
        return { ...old, data: old.data.map((f: any) => (f.id === ficId ? updater(f) : f)) };
      });
    }
  });
}

export function useAddFic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      author: string;
      description: string;
      fandoms: string[];
      language: string;
      status: string;
      tags: string[];
      mature: boolean;
      link?: string;
      words?: number | null;
      chapters?: number | null;
    }): Promise<Fanfic> => api.post("/api/fics", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fics"] }),
  });
}

export function useRateFic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ficId, score }: { ficId: string; score: number }) =>
      api.post(`/api/fics/${ficId}/rate`, { score }),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["fic", vars.ficId] }),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ficId }: { ficId: string; userId: string }) =>
      api.post(`/api/fics/${ficId}/favorite`),
    onMutate: async ({ ficId, userId }) => {
      await qc.cancelQueries({ queryKey: ["fic", ficId] });
      await qc.cancelQueries({ queryKey: ["fics"] });

      const prevFic = qc.getQueryData(["fic", ficId]);
      const prevFics = qc.getQueriesData({ queryKey: ["fics"] });

      updateFicInCaches(qc, ficId, (fic: any) => {
        if (!fic) return fic;
        const favArr = fic.favoritedBy ?? [];
        const exists = favArr.some((f: any) => (f.userId ?? f.id) === userId);
        return {
          ...fic,
          favoritedBy: exists
            ? favArr.filter((f: any) => (f.userId ?? f.id) !== userId)
            : [...favArr, { id: userId }],
          _count: fic._count
            ? { ...fic._count, favoritedBy: Math.max(0, (fic._count.favoritedBy ?? 0) + (exists ? -1 : 1)) }
            : fic._count,
        };
      });

      return { prevFic, prevFics };
    },
    onError: (_err, { ficId }, ctx) => {
      if (ctx?.prevFic) qc.setQueryData(["fic", ficId], ctx.prevFic);
      if (ctx?.prevFics) ctx.prevFics.forEach(([k, v]) => qc.setQueryData(k, v));
    },
    onSettled: (_data, _err, { ficId }) => {
      qc.invalidateQueries({ queryKey: ["fic", ficId] });
      qc.invalidateQueries({ queryKey: ["fics"] });
    },
  });
}

export function useToggleReadLater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ficId }: { ficId: string; userId: string }) =>
      api.post<{ saved: boolean }>(`/api/fics/${ficId}/readlater`),
    onMutate: async ({ ficId, userId }) => {
      await qc.cancelQueries({ queryKey: ["fic", ficId] });
      await qc.cancelQueries({ queryKey: ["fics"] });

      const prevFic = qc.getQueryData(["fic", ficId]);
      const prevFics = qc.getQueriesData({ queryKey: ["fics"] });

      updateFicInCaches(qc, ficId, (fic: any) => {
        if (!fic) return fic;
        const readArr = fic.readBy ?? [];
        const exists = readArr.some((r: any) => (r.id ?? r.userId) === userId);
        return {
          ...fic,
          readBy: exists
            ? readArr.filter((r: any) => (r.id ?? r.userId) !== userId)
            : [...readArr, { id: userId }],
        };
      });

      return { prevFic, prevFics };
    },
    onError: (_err, { ficId }, ctx) => {
      if (ctx?.prevFic) qc.setQueryData(["fic", ficId], ctx.prevFic);
      if (ctx?.prevFics) ctx.prevFics.forEach(([k, v]) => qc.setQueryData(k, v));
    },
    onSettled: (_data, _err, { ficId }) => {
      qc.invalidateQueries({ queryKey: ["fic", ficId] });
      qc.invalidateQueries({ queryKey: ["fics"] });
      qc.invalidateQueries({ queryKey: ["reading-list"] });
    },
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ficId, text }: { ficId: string; text: string }) =>
      api.post(`/api/fics/${ficId}/comments`, { text }),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["fic", vars.ficId] }),
  });
}