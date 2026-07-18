import { describe, it, expect } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import { BookOpen } from 'lucide-react'
import { EmptyState } from '@/shared/components/common/empty-state'

describe('EmptyState', () => {
  it('renders title and icon', () => {
    render(<EmptyState icon={BookOpen} title="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders optional description', () => {
    render(<EmptyState icon={BookOpen} title="Empty" description="No items found" />)
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('renders action link when provided', () => {
    render(
      <EmptyState
        icon={BookOpen}
        title="No fics"
        action={{ label: 'Add one', href: '/add' }}
      />,
    )
    const link = screen.getByText('Add one')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/add')
  })
})
