import { describe, it, expect, vi } from 'vitest'
import { renderWithAuth, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { FicCard } from '@/shared/components/common/fic-card'

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
  tags: ['angst', 'fluff', 'drama'],
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

describe('FicCard', () => {
  it('renders fic details', () => {
    renderWithAuth(<FicCard fic={baseFic} />)
    expect(screen.getByText('Test Fic')).toBeInTheDocument()
    expect(screen.getByText(/Author Name/)).toBeInTheDocument()
    expect(screen.getByText('A great story about testing')).toBeInTheDocument()
    expect(screen.getByText('Harry Potter')).toBeInTheDocument()
  })

  it('renders status and maturity badges', () => {
    renderWithAuth(<FicCard fic={baseFic} />)
    expect(screen.getByText('complete')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('shows tags up to 4', () => {
    renderWithAuth(<FicCard fic={baseFic} />)
    expect(screen.getByText('angst')).toBeInTheDocument()
    expect(screen.getByText('fluff')).toBeInTheDocument()
    expect(screen.getByText('drama')).toBeInTheDocument()
  })

  it('links to fic detail page', () => {
    renderWithAuth(<FicCard fic={baseFic} />)
    const link = screen.getByText('Test Fic').closest('a')
    expect(link).toHaveAttribute('href', '/fic/fic-1')
  })

  it('calls toggle favorite on heart click', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.post).mockResolvedValue({ success: true })
    const user = userEvent.setup()
    renderWithAuth(<FicCard fic={baseFic} />)

    const favBtn = screen.getByLabelText('Toggle favorite')
    await user.click(favBtn)

    const { api } = await import('@/shared/lib/api-client')
    expect(vi.mocked(api.post)).toHaveBeenCalledWith('/api/fics/fic-1/favorite')
  })

  it('calls toggle read later on bookmark click', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.post).mockResolvedValue({ success: true })
    const user = userEvent.setup()
    renderWithAuth(<FicCard fic={baseFic} />)

    const listBtn = screen.getByLabelText('Toggle reading list')
    await user.click(listBtn)

    const { api } = await import('@/shared/lib/api-client')
    expect(vi.mocked(api.post)).toHaveBeenCalledWith('/api/fics/fic-1/readlater')
  })

  it('renders with highlight', async () => {
    const { container } = renderWithAuth(<FicCard fic={baseFic} highlight="Test" />)
    const mark = container.querySelector('mark')
    expect(mark).toBeInTheDocument()
    expect(mark).toHaveTextContent('Test')
  })
})
