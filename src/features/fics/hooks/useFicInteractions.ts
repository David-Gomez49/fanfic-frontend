"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";
import type { Fanfic } from "../types";

export function useRefreshFic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.put<Fanfic>(`/api/fics/${id}/refresh`),
    onSuccess: (fic) => {
      qc.invalidateQueries({ queryKey: ["fic", fic.id] });
      qc.invalidateQueries({ queryKey: ["fics"] });
    },
  });
}

export function useScrape() {
  return useMutation({
    mutationFn: (url: string) =>
      api.post<Fanfic>("/api/scrape", { url }),
  });
}
