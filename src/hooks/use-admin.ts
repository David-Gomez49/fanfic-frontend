import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface AdminStats {
  totalUsers: number;
  totalFics: number;
  totalComments: number;
  totalTags: number;
  totalFandoms: number;
  todayFics: number;
  recentFics: number;
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  isAdmin: boolean;
  createdAt: string;
  _count: { fics: number; comments: number; ratings: number };
}

export interface AdminFic {
  id: string;
  title: string;
  author: string;
  description?: string;
  status: string;
  language: string;
  mature: boolean;
  link?: string | null;
  words?: number | null;
  chapters?: number | null;
  externalId?: string | null;
  publishedAt?: string | null;
  externalUpdatedAt?: string | null;
  tags: string[];
  fandoms: string[];
  addedBy: { id: string; name: string };
  createdAt: string;
  _count: { comments: number; ratings: number; favoritedBy: number };
}

export interface AdminFicsResponse {
  data: AdminFic[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminComment {
  id: string;
  text: string;
  user: { id: string; name: string };
  fic: { id: string; title: string };
  createdAt: string;
}

export interface AdminCommentsResponse {
  data: AdminComment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminTag {
  id: string;
  name: string;
  fanficCount: number;
}

export interface AdminTagsResponse {
  data: AdminTag[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminFandom {
  id: string;
  name: string;
  fanficCount: number;
  aliases: string[];
}

export interface AdminFandomsResponse {
  data: AdminFandom[];
  total: number;
  page: number;
  totalPages: number;
}

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
    mutationFn: (name: string) =>
      api.post("/api/admin/tags", { name }),
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
    mutationFn: (name: string) =>
      api.post("/api/admin/fandoms", { name }),
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

export function useMergeTags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceId, targetId }: { sourceId: string; targetId: string }) =>
      api.post("/api/admin/tags/merge", { sourceId, targetId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tags"] }),
  });
}

// ── Feedback ──

export interface AdminFeedback {
  id: string;
  type: string;
  subject: string | null;
  text: string;
  status: string;
  userId: string | null;
  user: { id: string; name: string } | null;
  ficId: string | null;
  fic: { id: string; title: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFeedbackResponse {
  data: AdminFeedback[];
  total: number;
  page: number;
  totalPages: number;
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
