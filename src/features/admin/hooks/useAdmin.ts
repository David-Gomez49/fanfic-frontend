"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";
import type { AdminStats, AdminUser, AdminFicsResponse, AdminCommentsResponse, AdminTagsResponse, AdminFandomsResponse, AdminFeedbackResponse } from "../types";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get<AdminStats>("/api/admin/stats"),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get<AdminUser[]>("/api/admin/users"),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; email: string; isAdmin: boolean }> }) =>
      api.patch(`/api/admin/users/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useAdminFics(page = 1, search = "") {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search) params.set("search", search);
  return useQuery({
    queryKey: ["admin", "fics", page, search],
    queryFn: () => api.get<AdminFicsResponse>(`/api/admin/fics?${params}`),
  });
}

export function useUpdateFic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/admin/fics/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "fics"] }),
  });
}

export function useDeleteFic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/fics/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "fics"] }),
  });
}

export function useAdminComments(page = 1, search = "") {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search) params.set("search", search);
  return useQuery({
    queryKey: ["admin", "comments", page, search],
    queryFn: () => api.get<AdminCommentsResponse>(`/api/admin/comments?${params}`),
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/comments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "comments"] }),
  });
}

export function useAdminTags(page = 1, search = "") {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search) params.set("search", search);
  return useQuery({
    queryKey: ["admin", "tags", page, search],
    queryFn: () => api.get<AdminTagsResponse>(`/api/admin/tags?${params}`),
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.post("/api/admin/tags", { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tags"] }),
  });
}

export function useRenameTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch(`/api/admin/tags/${id}`, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tags"] }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/tags/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tags"] }),
  });
}

export function useMergeTags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      api.post("/api/admin/tags/merge", { sourceId, targetId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tags"] }),
  });
}

export function useAdminFandoms(page = 1, search = "") {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search) params.set("search", search);
  return useQuery({
    queryKey: ["admin", "fandoms", page, search],
    queryFn: () => api.get<AdminFandomsResponse>(`/api/admin/fandoms?${params}`),
  });
}

export function useCreateFandom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.post("/api/admin/fandoms", { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "fandoms"] }),
  });
}

export function useRenameFandom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch(`/api/admin/fandoms/${id}`, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "fandoms"] }),
  });
}

export function useDeleteFandom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/fandoms/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "fandoms"] }),
  });
}

export function useMergeFandoms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      api.post("/api/admin/fandoms/merge", { sourceId, targetId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "fandoms"] }),
  });
}

export function useAdminFeedback(page = 1, search = "", type = "", status = "") {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search) params.set("search", search);
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  return useQuery({
    queryKey: ["admin", "feedback", page, search, type, status],
    queryFn: () => api.get<AdminFeedbackResponse>(`/api/feedback/admin?${params}`),
  });
}

export function useUpdateFeedbackStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/feedback/admin/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "feedback"] }),
  });
}

export function useDeleteFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/feedback/admin/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "feedback"] }),
  });
}
