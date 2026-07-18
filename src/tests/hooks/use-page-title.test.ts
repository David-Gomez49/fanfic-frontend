import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePageTitle } from '@/shared/hooks/use-page-title'

describe('usePageTitle', () => {
  it('sets the document title with the base suffix', () => {
    renderHook(() => usePageTitle('Browse'))
    expect(document.title).toBe('Browse · Ficshelf')
  })

  it('resets to base when no title is given', () => {
    const { rerender } = renderHook(
      ({ title }: { title?: string }) => usePageTitle(title),
      { initialProps: { title: 'Browse' } },
    )
    expect(document.title).toBe('Browse · Ficshelf')

    rerender({ title: undefined })
    expect(document.title).toBe('Ficshelf')
  })
})
