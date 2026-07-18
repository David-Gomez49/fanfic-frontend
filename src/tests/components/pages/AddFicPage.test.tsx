import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithAuth, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import AddFicPage from '@/features/fics/pages/AddFicPage'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

describe('AddFicPage', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockResolvedValue({ id: 'u1', name: 'Test User', isAdmin: false })
  })

  it('renders the form title', () => {
    renderWithAuth(<AddFicPage />)
    expect(screen.getByText('Add fanfiction')).toBeInTheDocument()
  })

  it('shows form fields', () => {
    renderWithAuth(<AddFicPage />)
    expect(screen.getByPlaceholderText('https://…')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/No spoilers/)).toBeInTheDocument()
    expect(screen.getByText('Publish')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderWithAuth(<AddFicPage />)

    await user.click(screen.getByText('Publish'))

    expect(screen.getAllByText('Required').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Add at least one tag')).toBeInTheDocument()
  })
})
