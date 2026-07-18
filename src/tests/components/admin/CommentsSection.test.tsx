import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import CommentsSection from '@/features/admin/components/comments-section'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockCommentsPage = {
  data: [
    { id: 'c1', text: 'Great story!', user: { id: 'u1', name: 'Alice' }, fic: { id: 'f1', title: 'My Fic' }, createdAt: '2024-06-15' },
    { id: 'c2', text: 'I loved the ending', user: { id: 'u2', name: 'Bob' }, fic: { id: 'f2', title: 'Another Fic' }, createdAt: '2024-07-01' },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
}

describe('CommentsSection', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/comments')) return Promise.resolve(mockCommentsPage)
      return Promise.resolve([])
    })
  })

  it('renders skeleton while loading', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation(() => new Promise(() => {}))
    const { container } = render(<CommentsSection />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders comment cards', async () => {
    render(<CommentsSection />)
    expect(await screen.findByText('Great story!')).toBeInTheDocument()
    expect(screen.getByText('I loved the ending')).toBeInTheDocument()
  })

  it('renders user and fic links', async () => {
    render(<CommentsSection />)
    expect(await screen.findByText('@Alice')).toBeInTheDocument()
    expect(screen.getByText('@Bob')).toBeInTheDocument()
    expect(screen.getByText('My Fic')).toBeInTheDocument()
    expect(screen.getByText('Another Fic')).toBeInTheDocument()
  })

  it('shows empty state when no comments', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/comments')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      return Promise.resolve([])
    })
    render(<CommentsSection />)
    expect(await screen.findByText('No comments found.')).toBeInTheDocument()
  })

  it('opens confirm modal on delete click', async () => {
    const user = userEvent.setup()
    render(<CommentsSection />)

    await screen.findByText('Great story!')
    await user.click(screen.getAllByLabelText('Delete comment')[0])

    expect(screen.getByText('Delete comment?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('calls delete mutation on confirm', async () => {
    const user = userEvent.setup()
    render(<CommentsSection />)

    await screen.findByText('Great story!')
    await user.click(screen.getAllByLabelText('Delete comment')[0])
    await user.click(screen.getByText('Delete'))

    const api = await import('@/shared/lib/api-client')
    await waitFor(() => {
      expect(api.api.delete).toHaveBeenCalledWith('/api/admin/comments/c1')
    })
  })
})
