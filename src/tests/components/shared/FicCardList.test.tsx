import { describe, it, expect, vi } from 'vitest'
import { renderWithAuth, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { FicCardList } from '@/shared/components/common/fic-card-list'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const baseFic = {
  id: 'fic-1',
  title: 'Test Fic',
  author: 'Author Name',
  description: 'A great story about testing',
  fandoms: ['Harry Potter'],
  status: 'complete',
  language: 'en',
  tags: ['angst', 'fluff', 'drama', 'romance', 'slow burn', 'fantasy', 'extra'],
  mature: false,
  avgRating: 4.5,
  ratings: [],
  comments: [],
  favoritedBy: [{ userId: 'user-2' }],
  addedBy: 'user-2',
  createdAt: '2024-01-01',
  words: 50000,
  chapters: 10,
  kudos: 50,
  _count: { comments: 3, ratings: 5, favoritedBy: 2 },
}

describe('FicCardList', () => {
  it('renders fic details', () => {
    renderWithAuth(<FicCardList fic={baseFic} />)
    expect(screen.getByText('Test Fic')).toBeInTheDocument()
    expect(screen.getByText(/Author Name/)).toBeInTheDocument()
    expect(screen.getByText('A great story about testing')).toBeInTheDocument()
    expect(screen.getByText('Harry Potter')).toBeInTheDocument()
  })

  it('renders badges', () => {
    renderWithAuth(<FicCardList fic={baseFic} />)
    expect(screen.getByText('complete')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('shows formatted word count', () => {
    renderWithAuth(<FicCardList fic={baseFic} />)
    expect(screen.getByText(/50\.?0?K words/)).toBeInTheDocument()
  })

  it('shows up to 6 tags', () => {
    renderWithAuth(<FicCardList fic={baseFic} />)
    expect(screen.getByText('angst')).toBeInTheDocument()
    expect(screen.getByText('fantasy')).toBeInTheDocument()
  })

  it('shows +N for tags beyond 6', () => {
    renderWithAuth(<FicCardList fic={baseFic} />)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('links to fic detail page', () => {
    renderWithAuth(<FicCardList fic={baseFic} />)
    const link = screen.getByText('Test Fic').closest('a')
    expect(link).toHaveAttribute('href', '/fic/fic-1')
  })

  it('calls toggle favorite on heart click', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.post).mockResolvedValue({ success: true })
    const user = userEvent.setup()
    renderWithAuth(<FicCardList fic={baseFic} />)

    await user.click(screen.getByLabelText('Toggle favorite'))

    const { api } = await import('@/shared/lib/api-client')
    expect(vi.mocked(api.post)).toHaveBeenCalledWith('/api/fics/fic-1/favorite')
  })

  it('renders with highlight', () => {
    const { container } = renderWithAuth(<FicCardList fic={baseFic} highlight="Test" />)
    expect(container.querySelector('mark')).toHaveTextContent('Test')
  })
})
