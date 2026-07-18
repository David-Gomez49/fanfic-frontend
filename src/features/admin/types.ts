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

export type AdminTab = "dashboard" | "users" | "fics" | "comments" | "tags" | "fandoms" | "feedback";
