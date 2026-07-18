import { http, HttpResponse } from "msw"
import {
  mockUser,
  mockFanfic,
  mockFicsResponse,
  mockTagSuggestions,
  mockFandomSuggestions,
  mockStats,
  mockUserProfile,
  mockUserComments,
  mockReadingList,
} from "./fixtures"

export const handlers = [
  http.get("*/api/auth/me", () => HttpResponse.json(mockUser)),
  http.post("*/api/auth/login", () => HttpResponse.json({ user: mockUser })),
  http.post("*/api/auth/register", () => HttpResponse.json({ user: mockUser })),
  http.post("*/api/auth/logout", () => HttpResponse.json({ success: true })),

  http.get("*/api/fics", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")
    const tags = url.searchParams.get("tags")
    const fandom = url.searchParams.get("fandom")
    const status = url.searchParams.get("status")
    const mature = url.searchParams.get("mature")
    const crossover = url.searchParams.get("crossover")

    if (search === "no-results") {
      return HttpResponse.json({ ...mockFicsResponse, data: [], total: 0 })
    }
    if (tags === "angst" && fandom === "Harry Potter") {
      return HttpResponse.json({ ...mockFicsResponse, data: [{ ...mockFanfic, id: "fic-filtered" }], total: 1 })
    }
    if (status === "complete") {
      return HttpResponse.json({ ...mockFicsResponse, data: [{ ...mockFanfic, status: "complete" }] })
    }
    if (mature === "mature") {
      return HttpResponse.json({ ...mockFicsResponse, data: [{ ...mockFanfic, mature: true }] })
    }
    if (crossover === "crossover") {
      return HttpResponse.json({ ...mockFicsResponse, data: [{ ...mockFanfic, fandoms: [...mockFanfic.fandoms, "Star Wars"] }] })
    }
    return HttpResponse.json(mockFicsResponse)
  }),

  http.get("*/api/fics/trending", () => HttpResponse.json([mockFanfic])),
  http.get("*/api/fics/top-rated", () => HttpResponse.json([mockFanfic])),

  http.get("*/api/fics/:id", ({ params }) => {
    if (params.id === "error") {
      return HttpResponse.json({ error: "Not found" }, { status: 404 })
    }
    return HttpResponse.json({ ...mockFanfic, id: params.id })
  }),

  http.post("*/api/fics", () => HttpResponse.json(mockFanfic, { status: 201 })),
  http.post("*/api/fics/:id/rate", () => HttpResponse.json({ success: true })),
  http.post("*/api/fics/:id/favorite", () => HttpResponse.json({ favorited: true })),
  http.post("*/api/fics/:id/readlater", () => HttpResponse.json({ saved: true })),
  http.post("*/api/fics/:id/comments", () => HttpResponse.json({ id: "c-new", text: "Nice!" }, { status: 201 })),
  http.put("*/api/fics/:id/refresh", () => HttpResponse.json(mockFanfic)),
  http.post("*/api/scrape", () => HttpResponse.json(mockFanfic)),

  http.get("*/api/tags/suggest", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? ""
    if (q === "zzz") return HttpResponse.json([])
    return HttpResponse.json(mockTagSuggestions)
  }),

  http.get("*/api/fandoms/suggest", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? ""
    if (q === "zzz") return HttpResponse.json([])
    return HttpResponse.json(mockFandomSuggestions)
  }),

  http.get("*/api/fandoms/autocomplete", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? ""
    if (q === "zzz") return HttpResponse.json([])
    return HttpResponse.json(mockTagSuggestions)
  }),

  http.get("*/api/stats", () => HttpResponse.json(mockStats)),
  http.get("*/api/users/:id", () => HttpResponse.json(mockUserProfile)),
  http.get("*/api/users/:userId/comments", () => HttpResponse.json(mockUserComments)),
  http.get("*/api/users/:userId/favorites", () => HttpResponse.json([mockFanfic])),
  http.get("*/api/users/:userId/added", () => HttpResponse.json([mockFanfic])),
  http.get("*/api/me/readinglist", () => HttpResponse.json(mockReadingList)),
]
