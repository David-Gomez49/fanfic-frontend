import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import DashboardSection from '@/features/admin/components/dashboard-section'

vi.mock('@/shared/lib/api-client', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockStats = {
  totalUsers: 42,
  totalFics: 150,
  totalComments: 320,
  totalTags: 85,
  totalFandoms: 12,
  todayFics: 5,
  recentFics: 23,
}

describe('DashboardSection', () => {
  beforeEach(async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/admin/stats') return Promise.resolve(mockStats)
      return Promise.resolve([])
    })
  })

  it('renders skeleton while loading', async () => {
    const api = await import('@/shared/lib/api-client')
    vi.mocked(api.api.get).mockImplementation(() => new Promise(() => {}))
    const { container } = render(<DashboardSection onNavigate={vi.fn()} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders stat values from API', async () => {
    render(<DashboardSection onNavigate={vi.fn()} />)
    expect(await screen.findByText('42')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('320')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('23')).toBeInTheDocument()
  })

  it('renders stat labels', async () => {
    render(<DashboardSection onNavigate={vi.fn()} />)
    expect(await screen.findByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Fanfics')).toBeInTheDocument()
    expect(screen.getByText('Comments')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Fandoms')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('This week')).toBeInTheDocument()
  })

  it('calls onNavigate with correct tab when card clicked', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()
    render(<DashboardSection onNavigate={onNavigate} />)

    await user.click(await screen.findByText('Users'))
    expect(onNavigate).toHaveBeenCalledWith('users')

    await user.click(screen.getByText('Fanfics'))
    expect(onNavigate).toHaveBeenCalledWith('fics')

    await user.click(screen.getByText('Tags'))
    expect(onNavigate).toHaveBeenCalledWith('tags')
  })

  it('shows 0 for missing stats', async () => {
    vi.mocked((await import('@/shared/lib/api-client')).api.get).mockImplementation((url: string) => {
      if (url === '/api/admin/stats') return Promise.resolve(undefined as any)
      return Promise.resolve([])
    })
    render(<DashboardSection onNavigate={vi.fn()} />)
    const zeros = await screen.findAllByText('0')
    expect(zeros.length).toBe(7)
  })
})
