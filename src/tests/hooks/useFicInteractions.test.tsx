import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from './test-wrapper'
import { useRefreshFic, useScrape } from '@/features/fics/hooks/useFicInteractions'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

import { api } from '@/shared/lib/api-client'

const wrapper = createWrapper()

describe('useRefreshFic', () => {
  it('sends PUT and returns refreshed fic', async () => {
    vi.mocked(api.put).mockResolvedValue({ id: 'fic-1', title: 'Test Fic' })
    const { result } = renderHook(() => useRefreshFic(), { wrapper })

    result.current.mutate('fic-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Test Fic')
  })
})

describe('useScrape', () => {
  it('sends POST with url and returns scraped fic', async () => {
    vi.mocked(api.post).mockResolvedValue({ id: 'fic-1', title: 'Test Fic' })
    const { result } = renderHook(() => useScrape(), { wrapper })

    result.current.mutate('https://example.com/fic/123')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Test Fic')
  })
})
