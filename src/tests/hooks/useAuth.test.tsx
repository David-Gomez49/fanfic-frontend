import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuth'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

import { api } from '@/shared/lib/api-client'

const mockUser = { id: 'user-1', name: 'Test User', email: 'test@test.com', image: null, isAdmin: false }

function renderAuthHook() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
  return renderHook(() => useAuth(), { wrapper })
}

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    )
  })

  it('loads the user on mount from /auth/me', async () => {
    vi.mocked(api.get).mockResolvedValue(mockUser)
    const { result } = renderAuthHook()

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.name).toBe('Test User')
  })

  it('login fetches user and updates state', async () => {
    vi.mocked(api.post).mockResolvedValue({ user: mockUser })
    vi.mocked(api.get).mockResolvedValue(mockUser)
    const { result } = renderAuthHook()

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.login('testuser', 'password123')
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.name).toBe('Test User')
  })

  it('register fetches user and updates state', async () => {
    vi.mocked(api.post).mockResolvedValue({ user: mockUser })
    vi.mocked(api.get).mockResolvedValue(mockUser)
    const { result } = renderAuthHook()

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.register('newuser', 'password123')
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.name).toBe('Test User')
  })

  it('logout clears user state', async () => {
    vi.mocked(api.get).mockResolvedValue(mockUser)
    vi.mocked(api.post).mockResolvedValue({ success: true })
    const { result } = renderAuthHook()

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).not.toBeNull()

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })
})
