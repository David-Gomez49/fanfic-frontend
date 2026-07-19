import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@/tests/test-utils'
import { renderWithAuth } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { UserMenu } from '@/features/auth/components/UserMenu'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockUser = { id: 'u1', name: 'Test User', email: 'test@test.com', image: null, isAdmin: false }

describe('UserMenu', () => {
  it('renders user initial and links to profile', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockResolvedValue(mockUser)
    renderWithAuth(<UserMenu />)
    await waitFor(() => expect(screen.getByText('T')).toBeInTheDocument())

    const link = screen.getByLabelText('Profile')
    expect(link).toHaveAttribute('href', '/profile')
  })

  it('opens confirm modal on sign out icon click', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockResolvedValue(mockUser)
    const user = userEvent.setup()
    renderWithAuth(<UserMenu />)

    await waitFor(() => expect(screen.getByLabelText('Sign out')).toBeInTheDocument())
    await user.click(screen.getByLabelText('Sign out'))

    expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument()
  })
})
