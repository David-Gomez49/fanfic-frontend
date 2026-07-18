import type { Fanfic, FicsResponse, TagSuggestion } from "@/features/fics/types"
import type { User } from "@/features/auth/hooks/useAuth"

export const mockUser: User = {
  id: "user-1",
  name: "Test User",
  email: "test@test.com",
  image: null,
  isAdmin: false,
}

export const mockFanfic: Fanfic = {
  id: "fic-1",
  title: "Test Fic",
  author: "Author",
  description: "A test fanfic",
  fandoms: ["Harry Potter"],
  status: "complete",
  language: "en",
  tags: ["angst"],
  mature: false,
  avgRating: 4.5,
  ratings: [],
  comments: [],
  favoritedBy: [],
  addedBy: "user-1",
  createdAt: new Date().toISOString(),
  words: 50000,
  chapters: 10,
  kudos: 50,
  publishedAt: null,
  externalUpdatedAt: null,
  _count: { comments: 0, ratings: 0, favoritedBy: 0 },
}

export const mockFicsResponse: FicsResponse = {
  data: [mockFanfic],
  total: 1,
  page: 1,
  totalPages: 1,
  availableTags: [],
  availableFandoms: [],
}

export const mockTagSuggestions: TagSuggestion[] = [
  { name: "angst", count: 10 },
  { name: "fluff", count: 8 },
]

export const mockFandomSuggestions = [
  { id: "hp", name: "Harry Potter", fanficCount: 15, score: 0.95, matchType: "strong" as const },
]

export const mockStats = {
  totalFics: 100,
  totalTags: 50,
  totalFandoms: 10,
}

export const mockUserProfile = {
  id: "user-1",
  name: "Test User",
  image: null,
  _count: { favorites: 5, readingList: 3, fics: 10, comments: 20 },
}

export const mockUserComments = [
  { id: "c1", text: "Great fic!", ficId: "fic-1", createdAt: new Date().toISOString(), fic: { id: "fic-1", title: "Test Fic" } },
]

export const mockReadingList: Fanfic[] = [mockFanfic]
