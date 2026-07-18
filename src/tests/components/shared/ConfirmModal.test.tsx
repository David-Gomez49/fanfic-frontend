import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from '@/shared/components/common/confirm-modal'

describe('ConfirmModal', () => {
  it('renders title and description when open', () => {
    render(
      <ConfirmModal open onOpenChange={vi.fn()} title="Delete?" description="Are you sure?" onConfirm={vi.fn()} />,
    )
    expect(screen.getByText('Delete?')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('calls onConfirm when delete is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(
      <ConfirmModal open onOpenChange={vi.fn()} title="Delete?" description="Sure?" onConfirm={onConfirm} />,
    )
    await user.click(screen.getByText('Delete'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ConfirmModal open onOpenChange={onOpenChange} title="Delete?" description="Sure?" onConfirm={vi.fn()} />,
    )
    await user.click(screen.getByText('Cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows loading state', () => {
    render(
      <ConfirmModal open onOpenChange={vi.fn()} title="Delete?" description="Sure?" onConfirm={vi.fn()} isLoading />,
    )
    expect(screen.getByText('Deleting…')).toBeInTheDocument()
  })
})
