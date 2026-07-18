import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import {
  useAddFic,
  useRateFic,
  useToggleFavorite,
  useToggleReadLater,
  useAddComment,
} from '@/features/fics/hooks/useFicMutations'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

import { api } from '@/shared/lib/api-client'

function renderMutHook<T>(hook: () => T) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  const spy = vi.spyOn(qc, 'invalidateQueries')
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
  const result = renderHook(hook, { wrapper })
  return { ...result, qc, spy }
}

describe('useAddFic', () => {
  it('posts data and returns the new fic', async () => {
    vi.mocked(api.post).mockResolvedValue({ id: 'fic-new', title: 'Test Fic' })
    const { result, spy } = renderMutHook(() => useAddFic())

    result.current.mutate({
      title: 'New Fic', author: 'Me', description: 'Desc',
      fandoms: ['HP'], language: 'en', status: 'ongoing', tags: [], mature: false,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Test Fic')
    expect(spy).toHaveBeenCalledWith({ queryKey: ['fics'] })
  })
})

describe('useRateFic', () => {
  it('posts score and invalidates fic query', async () => {
    vi.mocked(api.post).mockResolvedValue({ success: true })
    const { result, spy } = renderMutHook(() => useRateFic())

    result.current.mutate({ ficId: 'fic-1', score: 5 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(spy).toHaveBeenCalledWith({ queryKey: ['fic', 'fic-1'] })
  })
})

describe('useToggleFavorite', () => {
  it('posts and invalidates both fics and fic queries', async () => {
    vi.mocked(api.post).mockResolvedValue({ favorited: true })
    const { result, spy } = renderMutHook(() => useToggleFavorite())

    result.current.mutate('fic-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(spy).toHaveBeenCalledWith({ queryKey: ['fic', 'fic-1'] })
    expect(spy).toHaveBeenCalledWith({ queryKey: ['fics'] })
  })
})

describe('useToggleReadLater', () => {
  it('posts and invalidates all related queries', async () => {
    vi.mocked(api.post).mockResolvedValue({ saved: true })
    const { result, spy } = renderMutHook(() => useToggleReadLater())

    result.current.mutate('fic-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(spy).toHaveBeenCalledWith({ queryKey: ['fic', 'fic-1'] })
    expect(spy).toHaveBeenCalledWith({ queryKey: ['fics'] })
    expect(spy).toHaveBeenCalledWith({ queryKey: ['reading-list'] })
  })
})

describe('useAddComment', () => {
  it('posts comment and invalidates fic query', async () => {
    vi.mocked(api.post).mockResolvedValue({ id: 'c-new', text: 'Great!' })
    const { result, spy } = renderMutHook(() => useAddComment())

    result.current.mutate({ ficId: 'fic-1', text: 'Great!' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(spy).toHaveBeenCalledWith({ queryKey: ['fic', 'fic-1'] })
  })
})
