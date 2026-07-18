import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithAuth as render, screen, waitFor } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import AdminPage from '@/features/admin/pages/AdminPage'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const adminApiHandler = (url: string) => {
  if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
  if (url === '/api/admin/stats') return Promise.resolve({ totalUsers: 42, totalFics: 150, totalComments: 320, totalTags: 85, totalFandoms: 12, todayFics: 5, recentFics: 23 })
  if (url.startsWith('/api/admin/users')) return Promise.resolve([])
  if (url.startsWith('/api/admin/fics')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
  if (url.startsWith('/api/admin/comments')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
  if (url.startsWith('/api/admin/tags')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
  if (url.startsWith('/api/admin/fandoms')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
  if (url.startsWith('/api/feedback/admin')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
  return Promise.resolve([])
}

describe('AdminPage', () => {
  beforeEach(async () => {
    const api = await import('@/shared/lib/api-client')
    api.api.get.mockReset()
    api.api.get.mockImplementation(adminApiHandler)
  })

  it('renders admin page heading for admin user', async () => {
    render(<AdminPage />)
    expect(await screen.findByText('Admin', { selector: 'h1' })).toBeInTheDocument()
  })

  it('shows user handle', async () => {
    render(<AdminPage />)
    expect(await screen.findByText('@Admin')).toBeInTheDocument()
  })

  it('renders all tab buttons', async () => {
    render(<AdminPage />)
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
    expect(screen.getAllByText('Users').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Fics')).toBeInTheDocument()
    expect(screen.getByText('Comments')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Fandoms')).toBeInTheDocument()
    expect(screen.getByText('Feedback')).toBeInTheDocument()
  })

  it('shows dashboard section by default', async () => {
    render(<AdminPage />)
    expect(await screen.findByText('42')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('switches section when tab is clicked', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)

    await screen.findByText('Dashboard')
    const feedbackBtn = screen.getByText('Feedback')
    await user.click(feedbackBtn)

    expect(await screen.findByText('No feedback found.')).toBeInTheDocument()
  })

  it('shows breadcrumb', async () => {
    render(<AdminPage />)
    const adminTexts = await screen.findAllByText('Admin')
    expect(adminTexts.length).toBeGreaterThanOrEqual(2)
  })

  it('redirects to home for non-admin user', async () => {
    const api = await import('@/shared/lib/api-client')
    api.api.get.mockReset()
    api.api.get.mockImplementation(async (url: string) => {
      if (url === '/api/auth/me') return { id: 'user-1', name: 'User', isAdmin: false }
      return []
    })

    render(<AdminPage />)

    expect(await screen.findByText('Access denied.')).toBeInTheDocument()
  })
})
