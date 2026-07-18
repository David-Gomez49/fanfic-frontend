import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import FeedbackSection from '@/features/admin/components/feedback-section'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockFeedbackPage = {
  data: [
    { id: 'fb1', type: 'bug', subject: 'Login broken', text: 'Cannot log in', status: 'pending', userId: 'u1', user: { id: 'u1', name: 'Alice' }, ficId: null, fic: null, createdAt: '2024-06-15', updatedAt: '2024-06-15' },
    { id: 'fb2', type: 'suggestion', subject: 'Add dark mode', text: 'Would be nice', status: 'resolved', userId: null, user: null, ficId: 'f1', fic: { id: 'f1', title: 'My Fic' }, createdAt: '2024-06-20', updatedAt: '2024-06-25' },
    { id: 'fb3', type: 'report', subject: null, text: 'Anonymous report', status: 'pending', userId: null, user: null, ficId: null, fic: null, createdAt: '2024-07-01', updatedAt: '2024-07-01' },
  ],
  total: 3,
  page: 1,
  totalPages: 1,
}

describe('FeedbackSection', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/feedback/admin')) return Promise.resolve(mockFeedbackPage)
      return Promise.resolve([])
    })
  })

  it('renders feedback cards', async () => {
    render(<FeedbackSection />)
    expect(await screen.findByText('Login broken')).toBeInTheDocument()
    expect(screen.getByText('Add dark mode')).toBeInTheDocument()
    expect(screen.getByText('Cannot log in')).toBeInTheDocument()
    expect(screen.getByText('Would be nice')).toBeInTheDocument()
  })

  it('renders type badges', async () => {
    render(<FeedbackSection />)
    expect(await screen.findByText('Bug')).toBeInTheDocument()
    expect(screen.getByText('Suggestion')).toBeInTheDocument()
  })

  it('renders status badges', async () => {
    render(<FeedbackSection />)
    expect(await screen.findByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Resolved')).toBeInTheDocument()
  })

  it('shows user link when user exists', async () => {
    render(<FeedbackSection />)
    expect(await screen.findByText('@Alice')).toBeInTheDocument()
  })

  it('shows "Anonymous" when no user', async () => {
    render(<FeedbackSection />)
    const anonymous = await screen.findAllByText('Anonymous')
    expect(anonymous.length).toBeGreaterThanOrEqual(1)
  })

  it('shows fic link when fic exists', async () => {
    render(<FeedbackSection />)
    expect(await screen.findByText('My Fic')).toBeInTheDocument()
  })

  it('shows resolve/dismiss buttons for pending items', async () => {
    render(<FeedbackSection />)
    const resolveButtons = await screen.findAllByLabelText('Mark resolved')
    const dismissButtons = await screen.findAllByLabelText('Dismiss')
    expect(resolveButtons.length).toBeGreaterThanOrEqual(1)
    expect(dismissButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('hides resolve/dismiss buttons for non-pending items', async () => {
    render(<FeedbackSection />)
    await screen.findByText('Add dark mode')
    const resolveButtons = screen.getAllByLabelText('Mark resolved')
    const resolvedCard = screen.getByText('Add dark mode').closest('.rounded-xl')
    expect(resolvedCard?.querySelector('[aria-label="Mark resolved"]')).toBeNull()
  })

  it('calls updateStatus on resolve', async () => {
    const user = userEvent.setup()
    render(<FeedbackSection />)

    await screen.findByText('Login broken')
    await user.click(screen.getAllByLabelText('Mark resolved')[0])

    const api = await import('@/shared/lib/api-client')
    await waitFor(() => {
      expect(api.api.patch).toHaveBeenCalledWith('/api/feedback/admin/fb1', { status: 'resolved' })
    })
  })

  it('calls delete mutation on confirm', async () => {
    const user = userEvent.setup()
    render(<FeedbackSection />)

    await screen.findByText('Login broken')
    await user.click(screen.getAllByLabelText('Delete feedback')[0])
    await user.click(screen.getByText('Delete'))

    const api = await import('@/shared/lib/api-client')
    await waitFor(() => {
      expect(api.api.delete).toHaveBeenCalledWith('/api/feedback/admin/fb1')
    })
  })

  it('shows empty state when no feedback', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/feedback/admin')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      return Promise.resolve([])
    })
    render(<FeedbackSection />)
    expect(await screen.findByText('No feedback found.')).toBeInTheDocument()
  })
})
