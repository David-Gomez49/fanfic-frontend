import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithAuth, screen } from '@/tests/test-utils'
import UserProfilePage from '@/features/profile/pages/UserProfilePage'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'u1' }),
}))

const mockProfile = {
  id: 'u1',
  name: 'Test User',
  image: null,
  _count: { favorites: 3, readingList: 2, fics: 5, comments: 1 },
}

const mockFic = (id: string) => ({
  id,
  title: `Fic ${id}`,
  author: 'Author',
  description: 'Test description',
  fandoms: ['Fandom'],
  status: 'complete',
  language: 'en',
  tags: ['tag'],
  mature: false,
  ratings: [],
  comments: [],
  favoritedBy: [],
  addedBy: 'u1',
  createdAt: '2024-01-01',
  words: 1000,
  chapters: 1,
  _count: { comments: 0, ratings: 0, favoritedBy: 0 },
})

const mockComments = [
  { id: 'c1', text: 'Nice fic!', ficId: 'f1', createdAt: '2024-06-15T00:00:00Z', fic: { id: 'f1', title: 'My Fic' } },
]

describe('UserProfilePage', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/users/u1') return Promise.resolve(mockProfile)
      if (url === '/api/users/u1/favorites') return Promise.resolve([mockFic('fav1')])
      if (url === '/api/users/u1/added') return Promise.resolve([mockFic('added1')])
      if (url === '/api/users/u1/comments') return Promise.resolve(mockComments)
      if (url === '/api/me/readinglist') return Promise.resolve([mockFic('read1')])
      if (url === '/api/auth/me') return Promise.resolve({ id: 'u1', name: 'Test User', isAdmin: false })
      return Promise.resolve([])
    })
  })

  it('renders user handle in heading', async () => {
    renderWithAuth(<UserProfilePage />)
    const heading = await screen.findByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/@Test User/)
  })

  it('shows profile stats', async () => {
    renderWithAuth(<UserProfilePage />)
    expect(await screen.findByText(/5 added/)).toBeInTheDocument()
    expect(screen.getByText(/3 favorites/)).toBeInTheDocument()
    expect(screen.getByText(/2 to read/)).toBeInTheDocument()
  })

  it('renders tabs for own profile', async () => {
    renderWithAuth(<UserProfilePage />)
    expect(await screen.findByText('Favorites (3)')).toBeInTheDocument()
    expect(screen.getByText('To read (2)')).toBeInTheDocument()
    expect(screen.getByText('Added (5)')).toBeInTheDocument()
    expect(screen.getByText('Comments (1)')).toBeInTheDocument()
  })

  it('shows edit profile button for own profile', async () => {
    renderWithAuth(<UserProfilePage />)
    expect(await screen.findByTitle('Edit profile')).toBeInTheDocument()
  })

  it('shows favorites tab content by default', async () => {
    renderWithAuth(<UserProfilePage />)
    expect(await screen.findByText('Fic fav1')).toBeInTheDocument()
  })
})
