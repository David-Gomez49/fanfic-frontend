import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface Fanfic {
  id: string;
  link?: string;
  title: string;
  author: string;
  description: string;
  fandoms: string[];
  status: string;
  language: string;
  tags: string[];
  mature: boolean;
  avgRating: number;
  ratings: { score: number; userId: string }[];
  comments: { id: string; user: string; text: string; createdAt: string }[];
  favoritedBy: { userId: string }[];
  readBy?: { id: string }[];
  addedBy: string;
  createdAt: string;
  words?: number | null;
  chapters?: number | null;
  kudos?: number | null;
  publishedAt?: string | null;
  externalUpdatedAt?: string | null;
  _count?: { comments: number; ratings: number; favoritedBy: number };
}

export interface FicsResponse {
  data: Fanfic[];
  total: number;
  page: number;
  totalPages: number;
  availableTags: { name: string; count: number }[];
  availableFandoms: { name: string; count: number }[];
}

export interface FicsParams {
  search?: string;
  sort?: string;
  tags?: string[];
  excludeTags?: string[];
  fandoms?: string[];
  excludeFandoms?: string[];
  status?: string;
  mature?: "all" | "general" | "mature";
  crossover?: "all" | "crossover" | "single";
  minWords?: number;
  page?: number;
}

export function useFics(params?: FicsParams) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.tags?.length) query.set("tags", params.tags.join(","));
  if (params?.excludeTags?.length) query.set("excludeTags", params.excludeTags.join(","));
  if (params?.fandoms?.length) query.set("fandom", params.fandoms.join(","));
  if (params?.excludeFandoms?.length) query.set("excludeFandoms", params.excludeFandoms.join(","));
  if (params?.status && params.status !== "all") query.set("status", params.status);
  if (params?.mature && params.mature !== "all") query.set("mature", params.mature);
  if (params?.crossover && params.crossover !== "all") query.set("crossover", params.crossover);
  if (params?.minWords && params.minWords > 0) query.set("minWords", String(params.minWords));
  if (params?.page && params.page > 1) query.set("page", String(params.page));
  const qs = query.toString();
  return useQuery({
    queryKey: ["fics", qs],
    queryFn: () => api.get<FicsResponse>(`/api/fics${qs ? `?${qs}` : ""}`),
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["fics", "trending"],
    queryFn: () => api.get<Fanfic[]>("/api/fics/trending?limit=8"),
  });
}

export function useTopRated() {
  return useQuery({
    queryKey: ["fics", "top-rated"],
    queryFn: () => api.get<Fanfic[]>("/api/fics/top-rated?limit=8"),
  });
}

export function useFic(id: string) {
  return useQuery({
    queryKey: ["fic", id],
    queryFn: () => api.get<Fanfic>(`/api/fics/${id}`),
    enabled: !!id,
  });
}

export function useAddFic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string; author: string; description: string;
      fandoms: string[]; language: string; status: string;
      tags: string[]; mature: boolean; link?: string;
      words?: number | null; chapters?: number | null;
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
    mutationFn: (ficId: string) =>
      api.post(`/api/fics/${ficId}/favorite`),
    onSuccess: (_data, ficId) => {
      qc.invalidateQueries({ queryKey: ["fic", ficId] });
      qc.invalidateQueries({ queryKey: ["fics"] });
    },
  });
}

export function useToggleReadLater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ficId: string) =>
      api.post<{ saved: boolean }>(`/api/fics/${ficId}/readlater`),
    onSuccess: (_data, ficId) => {
      qc.invalidateQueries({ queryKey: ["fic", ficId] });
      qc.invalidateQueries({ queryKey: ["fics"] });
      qc.invalidateQueries({ queryKey: ["reading-list"] });
    },
  });
}

export function useReadingList() {
  return useQuery({
    queryKey: ["reading-list"],
    queryFn: () => api.get<Fanfic[]>("/api/me/readinglist"),
  });
}

export interface TagSuggestion {
  name: string;
  count: number;
}

export interface FandomSuggestion {
  id: string;
  name: string;
  fanficCount: number;
  score: number;
  matchType: "strong" | "partial" | "weak";
}

export function useTagSuggestions(q: string) {
  return useQuery({
    queryKey: ["tag-suggestions", q],
    queryFn: () => api.get<TagSuggestion[]>(`/api/tags/suggest?q=${encodeURIComponent(q)}`),
    enabled: q.length >= 1,
  });
}

export function useFandomSuggestions(q: string) {
  return useQuery({
    queryKey: ["fandom-suggestions", q],
    queryFn: () => api.get<FandomSuggestion[]>(`/api/fandoms/suggest?q=${encodeURIComponent(q)}`),
    enabled: q.length >= 1,
  });
}

export function useFandomAutocomplete(q: string) {
  return useQuery({
    queryKey: ["fandom-autocomplete", q],
    queryFn: () => api.get<{ name: string; count: number }[]>(`/api/fandoms/autocomplete?q=${encodeURIComponent(q)}`),
    enabled: q.length >= 1,
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

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get<{ totalFics: number; totalTags: number; totalFandoms: number }>("/api/stats"),
  });
}

export interface UserComment {
  id: string;
  text: string;
  ficId: string;
  createdAt: string;
  fic: { id: string; title: string };
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; email?: string }) =>
      api.patch<{ id: string; name: string; email: string; isAdmin: boolean }>("/api/auth/me", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth"] }),
  });
}

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

export interface UserProfile {
  id: string;
  name: string;
  image?: string | null;
  _count: { favorites: number; readingList: number; fics: number; comments: number };
}

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => api.get<UserProfile>(`/api/users/${id}`),
    enabled: !!id,
  });
}

export function useUserComments(userId: string) {
  return useQuery({
    queryKey: ["user-comments", userId],
    queryFn: () => api.get<UserComment[]>(`/api/users/${userId}/comments`),
    enabled: !!userId,
  });
}

export function useUserFavorites(userId: string) {
  return useQuery({
    queryKey: ["user-favorites", userId],
    queryFn: () => api.get<Fanfic[]>(`/api/users/${userId}/favorites`),
    enabled: !!userId,
  });
}

export function useUserAdded(userId: string) {
  return useQuery({
    queryKey: ["user-added", userId],
    queryFn: () => api.get<Fanfic[]>(`/api/users/${userId}/added`),
    enabled: !!userId,
  });
}
