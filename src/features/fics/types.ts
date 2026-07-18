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

export interface UserComment {
  id: string;
  text: string;
  ficId: string;
  createdAt: string;
  fic: { id: string; title: string };
}

export interface UserProfile {
  id: string;
  name: string;
  image?: string | null;
  _count: { favorites: number; readingList: number; fics: number; comments: number };
}