import { describe, it, expect } from 'vitest'
import { render, screen } from './test-utils'

describe('Testing setup', () => {
  it('renders a simple component', () => {
    render(<div>Hello Tests</div>)
    expect(screen.getByText('Hello Tests')).toBeInTheDocument()
  })
})
