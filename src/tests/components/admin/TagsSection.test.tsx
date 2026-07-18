import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import TagsSection from '@/features/admin/components/tags-section'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockTagsPage = {
  data: [
    { id: 't1', name: 'angst', fanficCount: 15 },
    { id: 't2', name: 'fluff', fanficCount: 8 },
    { id: 't3', name: 'slow burn', fanficCount: 0 },
  ],
  total: 3,
  page: 1,
  totalPages: 1,
}

describe('TagsSection', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/tags')) return Promise.resolve(mockTagsPage)
      return Promise.resolve([])
    })
  })

  it('renders tag table', async () => {
    render(<TagsSection />)
    expect(await screen.findByText('angst')).toBeInTheDocument()
    expect(screen.getByText('fluff')).toBeInTheDocument()
    expect(screen.getByText('slow burn')).toBeInTheDocument()
  })

  it('displays fanfic count', async () => {
    render(<TagsSection />)
    expect(await screen.findByText('15')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows empty state when no tags', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', isAdmin: true })
      if (url.startsWith('/api/admin/tags')) return Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      return Promise.resolve([])
    })
    render(<TagsSection />)
    expect(await screen.findByText('No tags found.')).toBeInTheDocument()
  })

  it('enters inline rename mode on edit click', async () => {
    const user = userEvent.setup()
    render(<TagsSection />)

    await screen.findByText('angst')
    await user.click(screen.getAllByLabelText('Rename tag')[0])

    const input = screen.getByDisplayValue('angst')
    expect(input).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm rename')).toBeInTheDocument()
    expect(screen.getByLabelText('Cancel rename')).toBeInTheDocument()
  })

  it('calls rename mutation on confirm', async () => {
    const user = userEvent.setup()
    render(<TagsSection />)

    await screen.findByText('angst')
    await user.click(screen.getAllByLabelText('Rename tag')[0])

    const input = screen.getByDisplayValue('angst')
    await user.clear(input)
    await user.type(input, 'angst-renamed')
    await user.click(screen.getByLabelText('Confirm rename'))

    const api = await import('@/shared/lib/api-client')
    await waitFor(() => {
      expect(api.api.patch).toHaveBeenCalledWith('/api/admin/tags/t1', { name: 'angst-renamed' })
    })
  })

  it('cancels inline rename', async () => {
    const user = userEvent.setup()
    render(<TagsSection />)

    await screen.findByText('angst')
    await user.click(screen.getAllByLabelText('Rename tag')[0])
    await user.click(screen.getByLabelText('Cancel rename'))

    expect(screen.queryByLabelText('Confirm rename')).not.toBeInTheDocument()
  })

  it('blocks delete when tag has fics', async () => {
    const user = userEvent.setup()
    render(<TagsSection />)

    await screen.findByText('angst')
    await user.click(screen.getAllByLabelText('Delete tag')[0])

    expect(screen.queryByText('Delete tag?')).not.toBeInTheDocument()
  })

  it('opens confirm modal for tag with zero fics', async () => {
    const user = userEvent.setup()
    render(<TagsSection />)

    await screen.findByText('slow burn')
    const deleteButtons = screen.getAllByLabelText('Delete tag')
    await user.click(deleteButtons[2])

    expect(screen.getByText('Delete tag?')).toBeInTheDocument()
  })

  it('opens create dialog', async () => {
    const user = userEvent.setup()
    render(<TagsSection />)

    await screen.findByText('angst')
    await user.click(screen.getByText('New tag'))

    expect(screen.getByText('Create tag')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tag name')).toBeInTheDocument()
  })

  it('opens merge dialog', async () => {
    const user = userEvent.setup()
    render(<TagsSection />)

    await screen.findByText('angst')
    await user.click(screen.getByText('Merge'))

    expect(screen.getByText('Merge tags')).toBeInTheDocument()
    expect(screen.getByText('Source (will be deleted)')).toBeInTheDocument()
    expect(screen.getByText('Target (will receive fics)')).toBeInTheDocument()
  })
})
