import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from './test-wrapper'
import {
  useFics,
  useTrending,
  useTopRated,
  useFic,
  useTagSuggestions,
  useFandomSuggestions,
  useReadingList,
  useStats,
  useUserProfile,
  useUserComments,
  useUserFavorites,
} from '@/features/fics/hooks/useFics'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

import { api } from '@/shared/lib/api-client'

const wrapper = createWrapper()

const mockFanfic = {
  id: 'fic-1', title: 'Test Fic', author: 'Author', description: 'A test fic',
  fandoms: ['Harry Potter'], status: 'complete', language: 'en', tags: ['angst'],
  mature: false, avgRating: 4.5, ratings: [], comments: [], favoritedBy: [],
  addedBy: 'user-1', createdAt: '2024-01-01', words: 50000, chapters: 10, kudos: 50,
  _count: { comments: 0, ratings: 0, favoritedBy: 0 },
}

const mockFicsResponse = {
  data: [mockFanfic], total: 1, page: 1, totalPages: 1,
  availableTags: [], availableFandoms: [],
}

describe('useFics', () => {
  it('returns fics without params', async () => {
    vi.mocked(api.get).mockResolvedValue(mockFicsResponse)
    const { result } = renderHook(() => useFics(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.total).toBe(1)
  })

  it('filters by search', async () => {
    vi.mocked(api.get).mockResolvedValue(mockFicsResponse)
    const { result } = renderHook(() => useFics({ search: 'test' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('filters by tags and fandom', async () => {
    vi.mocked(api.get).mockResolvedValue(mockFicsResponse)
    const { result } = renderHook(
      () => useFics({ tags: ['angst'], fandoms: ['Harry Potter'] }),
      { wrapper },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('filters by status', async () => {
    vi.mocked(api.get).mockResolvedValue(mockFicsResponse)
    const { result } = renderHook(() => useFics({ status: 'complete' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useTrending', () => {
  it('returns trending fics', async () => {
    vi.mocked(api.get).mockResolvedValue([mockFanfic])
    const { result } = renderHook(() => useTrending(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useTopRated', () => {
  it('returns top rated fics', async () => {
    vi.mocked(api.get).mockResolvedValue([mockFanfic])
    const { result } = renderHook(() => useTopRated(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useFic', () => {
  it('returns a fic by id', async () => {
    vi.mocked(api.get).mockResolvedValue(mockFanfic)
    const { result } = renderHook(() => useFic('fic-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Test Fic')
  })

  it('is disabled when id is empty', () => {
    const { result } = renderHook(() => useFic(''), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('handles error response', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Not found'))
    const { result } = renderHook(() => useFic('error'), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useTagSuggestions', () => {
  it('returns suggestions when query has length >= 1', async () => {
    vi.mocked(api.get).mockResolvedValue([{ name: 'angst', count: 10 }])
    const { result } = renderHook(() => useTagSuggestions('ang'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })

  it('is disabled when query is empty', () => {
    const { result } = renderHook(() => useTagSuggestions(''), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useFandomSuggestions', () => {
  it('returns suggestions when query has length >= 1', async () => {
    vi.mocked(api.get).mockResolvedValue([{ id: 'hp', name: 'Harry Potter', fanficCount: 15, score: 0.95, matchType: 'strong' as const }])
    const { result } = renderHook(() => useFandomSuggestions('har'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })

  it('is disabled when query is empty', () => {
    const { result } = renderHook(() => useFandomSuggestions(''), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useReadingList', () => {
  it('returns reading list', async () => {
    vi.mocked(api.get).mockResolvedValue([mockFanfic])
    const { result } = renderHook(() => useReadingList(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useStats', () => {
  it('returns stats', async () => {
    vi.mocked(api.get).mockResolvedValue({ totalFics: 100, totalTags: 50, totalFandoms: 10 })
    const { result } = renderHook(() => useStats(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.totalFics).toBe(100)
  })
})

describe('useUserProfile', () => {
  it('returns user profile', async () => {
    vi.mocked(api.get).mockResolvedValue({
      id: 'user-1', name: 'Test User', image: null,
      _count: { favorites: 5, readingList: 3, fics: 10, comments: 20 },
    })
    const { result } = renderHook(() => useUserProfile('user-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Test User')
  })
})

describe('useUserComments', () => {
  it('returns user comments', async () => {
    vi.mocked(api.get).mockResolvedValue([
      { id: 'c1', text: 'Great!', ficId: 'fic-1', createdAt: '2024-01-01', fic: { id: 'fic-1', title: 'Test Fic' } },
    ])
    const { result } = renderHook(() => useUserComments('user-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useUserFavorites', () => {
  it('returns user favorites', async () => {
    vi.mocked(api.get).mockResolvedValue([mockFanfic])
    const { result } = renderHook(() => useUserFavorites('user-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})
