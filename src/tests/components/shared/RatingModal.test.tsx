import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { RatingModal } from '@/shared/components/common/rating-modal'

describe('RatingModal', () => {
  it('renders with current rating', () => {
    render(
      <RatingModal open onOpenChange={vi.fn()} currentRating={3.5} averageRating={4.2} ratingCount={10} onRate={vi.fn()} isPending={false} />,
    )
    expect(screen.getByText('Your rating')).toBeInTheDocument()
    expect(screen.getByText('3.5')).toBeInTheDocument()
    expect(screen.getByText(/Average: 4.2/)).toBeInTheDocument()
  })

  it('shows prompt when not yet rated', () => {
    render(
      <RatingModal open onOpenChange={vi.fn()} currentRating={null} averageRating={0} ratingCount={0} onRate={vi.fn()} isPending={false} />,
    )
    expect(screen.getByText("You haven't rated this fic yet")).toBeInTheDocument()
  })

  it('calls onRate when a star is clicked', async () => {
    const onRate = vi.fn()
    const user = userEvent.setup()
    render(
      <RatingModal open onOpenChange={vi.fn()} currentRating={null} averageRating={0} ratingCount={0} onRate={onRate} isPending={false} />,
    )
    const starButton = screen.getByLabelText('5 stars')
    await user.click(starButton)
    expect(onRate).toHaveBeenCalledWith(5)
  })
})
