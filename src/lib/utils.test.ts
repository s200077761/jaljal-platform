import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges conditional and static class names', () => {
    const result = cn('px-2', false && 'hidden', 'py-1', null, undefined, 'text-sm')
    expect(result).toBe('px-2 py-1 text-sm')
  })

  it('resolves conflicting tailwind utility classes with last one winning', () => {
    const result = cn('p-2', 'p-4', 'text-left', 'text-right')
    expect(result).toBe('p-4 text-right')
  })

  it('supports array/object clsx input forms', () => {
    const result = cn(['inline-flex', { hidden: false, block: true }], 'items-center')
    expect(result).toBe('inline-flex block items-center')
  })
})
