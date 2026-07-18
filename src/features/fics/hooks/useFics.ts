"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";
import type { Fanfic, FicsResponse, FicsParams } from "../types";

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

export function useTagSuggestions(q: string) {
  return useQuery({
    queryKey: ["tag-suggestions", q],
    queryFn: () => api.get<{ name: string; count: number }[]>(`/api/tags/suggest?q=${encodeURIComponent(q)}`),
    enabled: q.length >= 1,
  });
}

export function useFandomSuggestions(q: string) {
  return useQuery({
    queryKey: ["fandom-suggestions", q],
    queryFn: () =>
      api.get<{ id: string; name: string; fanficCount: number; score: number; matchType: string }[]>(
        `/api/fandoms/suggest?q=${encodeURIComponent(q)}`
      ),
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

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get<{ totalFics: number; totalTags: number; totalFandoms: number }>("/api/stats"),
  });
}

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => api.get<{ id: string; name: string; image?: string | null; _count: { favorites: number; readingList: number; fics: number; comments: number } }>(`/api/users/${id}`),
    enabled: !!id,
  });
}

export function useUserComments(userId: string) {
  return useQuery({
    queryKey: ["user-comments", userId],
    queryFn: () => api.get<{ id: string; text: string; ficId: string; createdAt: string; fic: { id: string; title: string } }[]>(`/api/users/${userId}/comments`),
    enabled: !!userId,
  });
}

export function useUserFavorites(userId: string) {
  return useQuery({
    queryKey: ["user-favorites", userId],
    queryFn: () => api.get<{ id: string; link?: string; title: string; author: string; description: string; fandoms: string[]; status: string; language: string; tags: string[]; mature: boolean; avgRating: number; ratings: { score: number; userId: string }[]; comments: { id: string; user: string; text: string; createdAt: string }[]; favoritedBy: { userId: string }[]; readBy?: { id: string }[]; addedBy: string; createdAt: string; words?: number | null; chapters?: number | null; kudos?: number | null; publishedAt?: string | null; externalUpdatedAt?: string | null; _count?: { comments: number; ratings: number; favoritedBy: number } }[]>(`/api/users/${userId}/favorites`),
    enabled: !!userId,
  });
}

export function useUserAdded(userId: string) {
  return useQuery({
    queryKey: ["user-added", userId],
    queryFn: () => api.get<{ id: string; link?: string; title: string; author: string; description: string; fandoms: string[]; status: string; language: string; tags: string[]; mature: boolean; avgRating: number; ratings: { score: number; userId: string }[]; comments: { id: string; user: string; text: string; createdAt: string }[]; favoritedBy: { userId: string }[]; readBy?: { id: string }[]; addedBy: string; createdAt: string; words?: number | null; chapters?: number | null; kudos?: number | null; publishedAt?: string | null; externalUpdatedAt?: string | null; _count?: { comments: number; ratings: number; favoritedBy: number } }[]>(`/api/users/${userId}/added`),
    enabled: !!userId,
  });
}

export function useReadingList() {
  return useQuery({
    queryKey: ["reading-list"],
    queryFn: () => api.get<Fanfic[]>("/api/me/readinglist"),
  });
}