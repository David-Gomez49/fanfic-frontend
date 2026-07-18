import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithAuth, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import BrowsePage from '@/features/fics/pages/BrowsePage'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockFic = (id: string) => ({
  id,
  title: `Fic ${id}`,
  author: 'Author',
  description: 'Description for testing',
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

const mockResponse = {
  data: [mockFic('1'), mockFic('2')],
  total: 2,
  totalPages: 1,
  page: 1,
  availableTags: [],
  availableFandoms: [],
}

describe('BrowsePage', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url.startsWith('/api/fics')) return Promise.resolve(mockResponse)
      return Promise.resolve([])
    })
  })

  it('renders page title and breadcrumb', async () => {
    renderWithAuth(<BrowsePage />)
    expect(screen.getAllByText('Browse').length).toBeGreaterThanOrEqual(1)
    expect(await screen.findByText('2 fanfictions found')).toBeInTheDocument()
  })

  it('shows fic cards from API', async () => {
    renderWithAuth(<BrowsePage />)
    expect(await screen.findByText('Fic 1')).toBeInTheDocument()
    expect(screen.getByText('Fic 2')).toBeInTheDocument()
  })

  it('toggles between grid and list view', async () => {
    const user = userEvent.setup()
    renderWithAuth(<BrowsePage />)

    await user.click(screen.getByLabelText('List view'))
    expect(screen.getByLabelText('List view').closest('button')).toHaveClass('bg-primary')
  })

  it('renders search input with keyboard shortcut', () => {
    renderWithAuth(<BrowsePage />)
    expect(screen.getByPlaceholderText('Title, author, fandom…')).toBeInTheDocument()
  })

  it('shows filter controls', () => {
    renderWithAuth(<BrowsePage />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Maturity')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Fandoms')).toBeInTheDocument()
    expect(screen.getByText('Words')).toBeInTheDocument()
  })

  it('shows sort dropdown', () => {
    renderWithAuth(<BrowsePage />)
    expect(screen.getByText('Popularity')).toBeInTheDocument()
  })
})
