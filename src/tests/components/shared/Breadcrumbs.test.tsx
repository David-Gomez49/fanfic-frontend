import { describe, it, expect } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import { Breadcrumbs } from '@/shared/components/common/breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders home link and all items', () => {
    render(<Breadcrumbs items={[{ label: 'Browse' }, { label: 'Fic', href: '/fic/1' }, { label: 'Details' }]} />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Browse')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('renders nav with aria label', () => {
    render(<Breadcrumbs items={[{ label: 'Browse' }]} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb')
  })

  it('makes last item plain text (not a link)', () => {
    render(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Current' }]} />)
    expect(screen.getByText('Current').tagName).toBe('SPAN')
  })
})
