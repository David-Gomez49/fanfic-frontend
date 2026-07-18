import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { FeedbackDialog } from '@/shared/components/common/feedback-dialog'

vi.mock('@/shared/lib/api-client', () => ({
  api: { post: vi.fn().mockResolvedValue({ success: true }) },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

describe('FeedbackDialog', () => {
  it('renders dialog when open', () => {
    render(<FeedbackDialog open onOpenChange={vi.fn()} />)
    expect(screen.getByText('Send feedback')).toBeInTheDocument()
  })

  it('shows report mode when defaultType is report', () => {
    render(<FeedbackDialog open onOpenChange={vi.fn()} defaultType="report" ficTitle="Test Fic" />)
    expect(screen.getByText('Report fanfic')).toBeInTheDocument()
    expect(screen.getByText(/Report issues with "Test Fic"/)).toBeInTheDocument()
  })

  it('calls api.post on submit with text', async () => {
    const { api } = await import('@/shared/lib/api-client')
    const user = userEvent.setup()
    render(<FeedbackDialog open onOpenChange={vi.fn()} />)

    const textarea = screen.getByPlaceholderText('Share your thoughts…')
    await user.type(textarea, 'Great site!')
    await user.click(screen.getByText('Send'))

    expect(vi.mocked(api.post)).toHaveBeenCalledWith('/api/feedback', {
      type: 'suggestion',
      subject: undefined,
      text: 'Great site!',
    })
  })

  it('shows required reason in report mode', async () => {
    const user = userEvent.setup()
    render(<FeedbackDialog open onOpenChange={vi.fn()} defaultType="report" />)

    const textarea = screen.getByPlaceholderText('Describe the issue in detail…')
    await user.type(textarea, 'Something wrong')

    const sendButton = screen.getByText('Submit report')
    expect(sendButton).toBeDisabled()

    const reasonSelect = screen.getByLabelText('Reason')
    await user.selectOptions(reasonSelect, 'Plagiarism')
    expect(sendButton).not.toBeDisabled()
  })
})
