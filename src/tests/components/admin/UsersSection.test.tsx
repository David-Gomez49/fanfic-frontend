import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import UsersSection from '@/features/admin/components/users-section'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockUsers = [
  { id: '1', name: 'Alice', email: 'alice@test.com', isAdmin: true, createdAt: '2024-01-15', _count: { fics: 5, comments: 12, ratings: 8 } },
  { id: '2', name: 'Bob', email: 'bob@test.com', isAdmin: false, createdAt: '2024-03-20', _count: { fics: 2, comments: 3, ratings: 1 } },
  { id: '3', name: null, email: null, isAdmin: false, createdAt: '2024-06-01', _count: { fics: 0, comments: 0, ratings: 0 } },
]

describe('UsersSection', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/auth/me') return Promise.resolve({ id: 'admin-1', name: 'Admin', email: 'admin@test.com', isAdmin: true })
      if (url === '/api/admin/users') return Promise.resolve(mockUsers)
      return Promise.resolve([])
    })
  })

  it('renders skeleton while loading', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation(() => new Promise(() => {}))
    const { container } = render(<UsersSection />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders user table with names and emails', async () => {
    render(<UsersSection />)
    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
  })

  it('displays em dash for null name and email', async () => {
    render(<UsersSection />)
    const emDashes = await screen.findAllByText('—')
    expect(emDashes.length).toBeGreaterThanOrEqual(1)
  })

  it('shows admin badge for admin users', async () => {
    render(<UsersSection />)
    await screen.findByText('Alice')
    const adminBadges = screen.getAllByText('Admin')
    expect(adminBadges.length).toBeGreaterThanOrEqual(1)
    const revokeButtons = screen.getAllByLabelText('Revoke admin')
    expect(revokeButtons.length).toBe(1)
  })

  it('toggles admin role on button click', async () => {
    const user = userEvent.setup()
    render(<UsersSection />)

    await screen.findByText('Alice')
    const grantButtons = screen.getAllByLabelText('Grant admin')
    await user.click(grantButtons[0])

    const api = await import('@/shared/lib/api-client')
    expect(api.api.patch).toHaveBeenCalledWith('/api/admin/users/2', { isAdmin: true })
  })

  it('opens confirm modal on delete click', async () => {
    const user = userEvent.setup()
    render(<UsersSection />)

    await screen.findByText('Alice')
    const deleteButtons = screen.getAllByLabelText('Delete user')
    await user.click(deleteButtons[0])

    expect(screen.getByText('Delete user?')).toBeInTheDocument()
    expect(screen.getByText(/Delete "Alice"/)).toBeInTheDocument()
  })

  it('filters users by client-side search', async () => {
    const user = userEvent.setup()
    render(<UsersSection />)

    await screen.findByText('Alice')
    const searchInput = screen.getByPlaceholderText('Filter users…')
    await user.type(searchInput, 'bob')

    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('shows empty state when no users match search', async () => {
    const user = userEvent.setup()
    render(<UsersSection />)

    await screen.findByText('Alice')
    const searchInput = screen.getByPlaceholderText('Filter users…')
    await user.type(searchInput, 'zzzzzzz')

    expect(screen.getByText('No users match.')).toBeInTheDocument()
  })

  it('calls delete mutation on confirm', async () => {
    const user = userEvent.setup()
    render(<UsersSection />)

    await screen.findByText('Alice')
    await user.click(screen.getAllByLabelText('Delete user')[0])
    await user.click(screen.getByText('Delete'))

    const api = await import('@/shared/lib/api-client')
    await waitFor(() => {
      expect(api.api.delete).toHaveBeenCalledWith('/api/admin/users/1')
    })
  })
})
