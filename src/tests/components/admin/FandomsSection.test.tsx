import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import FandomsSection from '@/features/admin/components/fandoms-section'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockFandomsPage = {
  data: [
    { id: 'f1', name: 'Harry Potter', fanficCount: 25, aliases: ['HP', 'Harry Potter Universe'] },
    { id: 'f2', name: 'Marvel', fanficCount: 10, aliases: [] },
    { id: 'f3', name: 'Original Work', fanficCount: 0, aliases: ['OC'] },
  ],
  total: 3,
  page: 1,
  totalPages: 1,
}

describe('FandomsSection', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/fandoms')) return Promise.resolve(mockFandomsPage)
      return Promise.resolve([])
    })
  })

  it('renders fandom table', async () => {
    render(<FandomsSection />)
    expect(await screen.findByText('Harry Potter')).toBeInTheDocument()
    expect(screen.getByText('Marvel')).toBeInTheDocument()
    expect(screen.getByText('Original Work')).toBeInTheDocument()
  })

  it('displays aliases', async () => {
    render(<FandomsSection />)
    expect(await screen.findByText('HP, Harry Potter Universe')).toBeInTheDocument()
  })

  it('shows em dash for empty aliases', async () => {
    render(<FandomsSection />)
    const emDashes = await screen.findAllByText('—')
    expect(emDashes.length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no fandoms', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/fandoms')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      return Promise.resolve([])
    })
    render(<FandomsSection />)
    expect(await screen.findByText('No fandoms found.')).toBeInTheDocument()
  })

  it('enters inline rename mode', async () => {
    const user = userEvent.setup()
    render(<FandomsSection />)

    await screen.findByText('Harry Potter')
    await user.click(screen.getAllByLabelText('Rename fandom')[0])

    const input = screen.getByDisplayValue('Harry Potter')
    expect(input).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm rename')).toBeInTheDocument()
    expect(screen.getByLabelText('Cancel rename')).toBeInTheDocument()
  })

  it('calls rename mutation on confirm', async () => {
    const user = userEvent.setup()
    render(<FandomsSection />)

    await screen.findByText('Harry Potter')
    await user.click(screen.getAllByLabelText('Rename fandom')[0])

    const input = screen.getByDisplayValue('Harry Potter')
    await user.clear(input)
    await user.type(input, 'HP Universe')
    await user.click(screen.getByLabelText('Confirm rename'))

    const api = await import('@/shared/lib/api-client')
    await waitFor(() => {
      expect(api.api.patch).toHaveBeenCalledWith('/api/admin/fandoms/f1', { name: 'HP Universe' })
    })
  })

  it('blocks delete when fandom has fics', async () => {
    const user = userEvent.setup()
    render(<FandomsSection />)

    await screen.findByText('Harry Potter')
    await user.click(screen.getAllByLabelText('Delete fandom')[0])

    expect(screen.queryByText('Delete fandom?')).not.toBeInTheDocument()
  })

  it('opens confirm modal for fandom with zero fics', async () => {
    const user = userEvent.setup()
    render(<FandomsSection />)

    await screen.findByText('Original Work')
    const deleteButtons = screen.getAllByLabelText('Delete fandom')
    await user.click(deleteButtons[2])

    expect(screen.getByText('Delete fandom?')).toBeInTheDocument()
  })

  it('opens create dialog', async () => {
    const user = userEvent.setup()
    render(<FandomsSection />)

    await screen.findByText('Harry Potter')
    await user.click(screen.getByText('New fandom'))

    expect(screen.getByText('Create fandom')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Fandom name')).toBeInTheDocument()
  })

  it('opens merge dialog', async () => {
    const user = userEvent.setup()
    render(<FandomsSection />)

    await screen.findByText('Harry Potter')
    await user.click(screen.getByText('Merge'))

    expect(screen.getByText('Merge fandoms')).toBeInTheDocument()
  })
})
