import { describe, it, expect } from 'vitest'
import {
  toNumber,
  formatCurrency,
  formatCompactCurrency,
  formatPercent,
  formatSignedPercent,
} from '#/shared/lib/format'

describe('toNumber', () => {
  it('returns number as-is', () => {
    expect(toNumber(42)).toBe(42)
  })

  it('converts string to number', () => {
    expect(toNumber('123.45')).toBe(123.45)
  })

  it('returns 0 for null/undefined/empty', () => {
    expect(toNumber(null)).toBe(0)
    expect(toNumber(undefined)).toBe(0)
    expect(toNumber('')).toBe(0)
  })
})

describe('formatCurrency', () => {
  it('formats KRW currency', () => {
    const result = formatCurrency(1500000)
    expect(result).toContain('1,500,000')
  })

  it('handles zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('handles negative values', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('500')
  })
})

describe('formatCompactCurrency', () => {
  it('formats large numbers compactly', () => {
    const result = formatCompactCurrency(1500000)
    expect(result).toBeTruthy()
  })
})

describe('formatPercent', () => {
  it('formats percentage with one decimal', () => {
    expect(formatPercent(12.345)).toBe('12.3%')
  })

  it('returns dash for null', () => {
    expect(formatPercent(null)).toBe('—')
  })

  it('returns dash for NaN', () => {
    expect(formatPercent(NaN)).toBe('—')
  })
})

describe('formatSignedPercent', () => {
  it('adds + prefix for positive values', () => {
    expect(formatSignedPercent(5.2)).toBe('+5.2%')
  })

  it('shows - prefix for negative values', () => {
    expect(formatSignedPercent(-3.1)).toBe('-3.1%')
  })

  it('returns dash for null', () => {
    expect(formatSignedPercent(null)).toBe('—')
  })

  it('handles zero', () => {
    expect(formatSignedPercent(0)).toBe('0.0%')
  })
})
