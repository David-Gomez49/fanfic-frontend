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
  it('renders user initial after auth loads', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockResolvedValue(mockUser)
    renderWithAuth(<UserMenu />)
    await waitFor(() => expect(screen.getByText('T')).toBeInTheDocument())
  })

  it('opens dialog and shows logout button on icon click', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockResolvedValue(mockUser)
    const user = userEvent.setup()
    renderWithAuth(<UserMenu />)

    await waitFor(() => expect(screen.getByLabelText('Profile')).toBeInTheDocument())
    await user.click(screen.getByLabelText('Profile'))

    expect(screen.getByText('Sign out')).toBeInTheDocument()
    expect(screen.getByText('View Profile')).toBeInTheDocument()
  })
})
