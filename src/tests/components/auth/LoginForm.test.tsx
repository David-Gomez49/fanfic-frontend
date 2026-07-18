import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/features/auth/components/LoginForm'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

describe('LoginForm', () => {
  it('renders sign in tab by default', () => {
    render(<LoginForm />)
    expect(screen.getByRole('tab', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your_username')).toBeInTheDocument()
  })

  it('switches to sign up tab', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    await user.click(screen.getByRole('tab', { name: 'Sign up' }))
    expect(screen.getByPlaceholderText('your_username')).toBeInTheDocument()
  })

  it('calls login mutation on submit', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.post).mockResolvedValue({ user: { id: 'u1', name: 'Test' } })
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('your_username'), 'testuser')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    await user.type(passwordInput, 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    const { api } = await import('@/shared/lib/api-client')
    expect(vi.mocked(api.post)).toHaveBeenCalledWith('/api/auth/login', {
      username: 'testuser',
      password: 'password123',
    })
  })

  it('shows error on failed login', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.post).mockRejectedValue(new Error('Invalid credentials'))
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('your_username'), 'baduser')
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})
