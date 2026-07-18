import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithAuth, screen } from '@/tests/test-utils'
import HomePage from '@/features/home/pages/HomePage'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockFic = (id: string) => ({
  id,
  title: `Fic ${id}`,
  author: 'Author',
  description: 'A test fic',
  fandoms: ['Test Fandom'],
  status: 'complete',
  language: 'en',
  tags: ['angst'],
  mature: false,
  ratings: [],
  comments: [],
  favoritedBy: [],
  addedBy: 'user-1',
  createdAt: '2024-01-01',
  words: 1000,
  chapters: 5,
  _count: { comments: 0, ratings: 0, favoritedBy: 0 },
})

describe('HomePage', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/stats') return Promise.resolve({ totalFics: 100, totalTags: 50, totalFandoms: 20 })
      if (url === '/api/fics/trending?limit=8') return Promise.resolve([mockFic('trend-1'), mockFic('trend-2')])
      if (url === '/api/fics/top-rated?limit=8') return Promise.resolve([mockFic('top-1'), mockFic('top-2')])
      return Promise.resolve([])
    })
  })

  it('renders hero section with title', async () => {
    renderWithAuth(<HomePage />)
    expect(screen.getByText(/literary obsession/)).toBeInTheDocument()
    expect(screen.getByText('Browse catalog')).toBeInTheDocument()
    expect(screen.getByText('Add a fic')).toBeInTheDocument()
  })

  it('shows stats from API', async () => {
    renderWithAuth(<HomePage />)
    expect(await screen.findByText('100')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('renders trending and top rated sections', async () => {
    renderWithAuth(<HomePage />)
    expect(await screen.findByText('Trending now')).toBeInTheDocument()
    expect(screen.getByText('Top rated')).toBeInTheDocument()
  })

  it('shows fic cards in trending section', async () => {
    renderWithAuth(<HomePage />)
    expect(await screen.findByText('Fic trend-1')).toBeInTheDocument()
    expect(screen.getByText('Fic trend-2')).toBeInTheDocument()
  })

  it('shows fic cards in top rated section', async () => {
    renderWithAuth(<HomePage />)
    expect(await screen.findByText('Fic top-1')).toBeInTheDocument()
    expect(screen.getByText('Fic top-2')).toBeInTheDocument()
  })
})
