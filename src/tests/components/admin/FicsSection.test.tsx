import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import FicsSection from '@/features/admin/components/fics-section'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockFic = (id: string, overrides = {}) => ({
  id,
  title: `Fic ${id}`,
  author: 'Test Author',
  description: 'A test description',
  status: 'in progress',
  language: 'en',
  mature: false,
  link: 'https://example.com',
  words: 50000,
  chapters: 10,
  tags: ['angst', 'fluff'],
  fandoms: ['Test Fandom'],
  addedBy: { id: 'u1', name: 'Admin' },
  createdAt: '2024-01-01',
  _count: { comments: 3, ratings: 5, favoritedBy: 2 },
  ...overrides,
})

const mockResponse = { data: [mockFic('f1'), mockFic('f2', { status: 'complete', title: 'Fic f2' })], total: 2, page: 1, totalPages: 1 }

describe('FicsSection', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/fics')) return Promise.resolve(mockResponse)
      return Promise.resolve([])
    })
  })

  it('renders fic table rows', async () => {
    render(<FicsSection />)
    expect(await screen.findByText('Fic f1')).toBeInTheDocument()
    expect(screen.getByText('Fic f2')).toBeInTheDocument()
    expect(screen.getAllByText('Test Author').length).toBeGreaterThanOrEqual(2)
  })

  it('renders status badges', async () => {
    render(<FicsSection />)
    expect(await screen.findByText('in progress')).toBeInTheDocument()
    expect(screen.getByText('complete')).toBeInTheDocument()
  })

  it('shows empty state when no fics', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/fics')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      return Promise.resolve([])
    })
    render(<FicsSection />)
    expect(await screen.findByText('No fics found.')).toBeInTheDocument()
  })

  it('opens delete confirm modal', async () => {
    const user = userEvent.setup()
    render(<FicsSection />)

    await screen.findByText('Fic f1')
    await user.click(screen.getAllByLabelText('Delete fic')[0])

    expect(screen.getByText('Delete fic?')).toBeInTheDocument()
    expect(screen.getByText(/Delete "Fic f1"/)).toBeInTheDocument()
  })

  it('calls delete mutation on confirm', async () => {
    const user = userEvent.setup()
    render(<FicsSection />)

    await screen.findByText('Fic f1')
    await user.click(screen.getAllByLabelText('Delete fic')[0])
    await user.click(screen.getByText('Delete'))

    const api = await import('@/shared/lib/api-client')
    await waitFor(() => {
      expect(api.api.delete).toHaveBeenCalledWith('/api/admin/fics/f1')
    })
  })

  it('shows pagination when multiple pages', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/fics')) return Promise.resolve({ data: [mockFic('f1')], total: 25, page: 1, totalPages: 2 })
      return Promise.resolve([])
    })
    render(<FicsSection />)
    expect(await screen.findByText('1 / 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
  })

  it('opens edit dialog on edit click', async () => {
    const user = userEvent.setup()
    render(<FicsSection />)

    await screen.findByText('Fic f1')
    await user.click(screen.getAllByLabelText('Edit fic')[0])

    expect(screen.getByText('Edit fanfic')).toBeInTheDocument()
  })
})
