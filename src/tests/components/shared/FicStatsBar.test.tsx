import { describe, it, expect } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import { FicStatsBar } from '@/shared/components/common/fic-stats-bar'

describe('FicStatsBar', () => {
  it('renders words and chapters', () => {
    render(<FicStatsBar words={50000} chapters={10} />)
    expect(screen.getByText('50.0K')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('formats large numbers with K and M', () => {
    render(<FicStatsBar words={1500000} chapters={200} />)
    expect(screen.getByText('1.5M')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  it('shows dash for null or undefined values', () => {
    render(<FicStatsBar words={null} chapters={undefined} />)
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(2)
  })

  it('renders comment, favorite and rating counts', () => {
    render(<FicStatsBar commentsCount={5} favoritesCount={3} ratingsCount={10} />)
    expect(screen.getByText('5 comments')).toBeInTheDocument()
    expect(screen.getByText('3 favorites')).toBeInTheDocument()
    expect(screen.getByText('10 ratings')).toBeInTheDocument()
  })

  it('uses singular for count of 1', () => {
    render(<FicStatsBar commentsCount={1} favoritesCount={1} ratingsCount={1} />)
    expect(screen.getByText('1 comment')).toBeInTheDocument()
    expect(screen.getByText('1 favorite')).toBeInTheDocument()
    expect(screen.getByText('1 rating')).toBeInTheDocument()
  })
})
