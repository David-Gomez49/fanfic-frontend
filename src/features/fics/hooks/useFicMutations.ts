"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";
import type { Fanfic } from "../types";

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
    mutationFn: (ficId: string) => api.post(`/api/fics/${ficId}/favorite`),
    onSuccess: (_data, ficId) => {
      qc.invalidateQueries({ queryKey: ["fic", ficId] });
      qc.invalidateQueries({ queryKey: ["fics"] });
    },
  });
}

export function useToggleReadLater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ficId: string) => api.post<{ saved: boolean }>(`/api/fics/${ficId}/readlater`),
    onSuccess: (_data, ficId) => {
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