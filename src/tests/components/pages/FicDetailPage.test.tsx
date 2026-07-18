import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithAuth, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import FicDetailPage from '@/features/fics/pages/FicDetailPage'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'fic-1' }),
  notFound: () => { throw new Error('NOT_FOUND') },
}))

const mockFic = {
  id: 'fic-1',
  title: 'Test Fic Detail',
  author: 'Author Name',
  description: 'A detailed description of a fanfiction for testing purposes.',
  fandoms: ['Harry Potter'],
  status: 'complete',
  language: 'en',
  tags: ['angst', 'fluff'],
  mature: false,
  link: 'https://example.com/fic',
  ratings: [{ score: 5, userId: 'user-2' }],
  comments: [
    { id: 'c1', user: { id: 'u1', name: 'Commenter' }, text: 'Great fic!', createdAt: '2024-06-15T00:00:00Z' },
  ],
  favoritedBy: [{ id: 'user-2' }],
  addedBy: { id: 'u1', name: 'Adder' },
  readBy: [{ id: 'user-2' }],
  createdAt: '2024-01-01T00:00:00Z',
  publishedAt: '2024-01-01T00:00:00Z',
  externalUpdatedAt: '2024-06-01T00:00:00Z',
  words: 50000,
  chapters: 10,
  _count: { comments: 1, ratings: 1, favoritedBy: 1 },
}

describe('FicDetailPage', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/fics/fic-1') return Promise.resolve(mockFic)
      if (url === '/api/auth/me') return Promise.resolve({ id: 'u1', name: 'Test User', isAdmin: false })
      return Promise.resolve([])
    })
  })

  it('renders fic title and author', async () => {
    renderWithAuth(<FicDetailPage />)
    expect(await screen.findByRole('heading', { level: 1, name: 'Test Fic Detail' })).toBeInTheDocument()
    expect(screen.getByText(/Author Name/)).toBeInTheDocument()
  })

  it('renders fandom and language', async () => {
    renderWithAuth(<FicDetailPage />)
    expect(await screen.findByText('Harry Potter')).toBeInTheDocument()
  })

  it('renders action buttons', async () => {
    renderWithAuth(<FicDetailPage />)
    expect(await screen.findByText('Favorite')).toBeInTheDocument()
    expect(screen.getByText('Read later')).toBeInTheDocument()
    expect(screen.getByText('Update')).toBeInTheDocument()
    expect(screen.getByText('Copy link')).toBeInTheDocument()
    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Report')).toBeInTheDocument()
  })

  it('renders stats bar', async () => {
    renderWithAuth(<FicDetailPage />)
    expect(await screen.findByText('50.0K')).toBeInTheDocument()
  })

  it('renders show more on long description', async () => {
    const longFic = { ...mockFic, description: 'A'.repeat(500) }
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/fics/fic-1') return Promise.resolve(longFic)
      if (url === '/api/auth/me') return Promise.resolve({ id: 'u1', name: 'Test User', isAdmin: false })
      return Promise.resolve([])
    })
    const user = userEvent.setup()
    renderWithAuth(<FicDetailPage />)

    expect(await screen.findByText('Show more')).toBeInTheDocument()
    await user.click(screen.getByText('Show more'))
    expect(screen.getByText('Show less')).toBeInTheDocument()
  })

  it('renders comments section', async () => {
    renderWithAuth(<FicDetailPage />)
    expect(await screen.findByText('Comments (1)')).toBeInTheDocument()
    expect(screen.getByText('Great fic!')).toBeInTheDocument()
  })

  it('shows rating stars', async () => {
    renderWithAuth(<FicDetailPage />)
    expect(await screen.findByText(/5\.0/)).toBeInTheDocument()
  })
})
