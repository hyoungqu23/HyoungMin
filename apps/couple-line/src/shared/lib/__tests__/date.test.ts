import { describe, it, expect } from 'vitest'
import {
  getMonthKey,
  getMonthLabel,
  formatDateLabel,
  getLast12MonthFrames,
  getPreviousMonthKey,
  getNextMonthKey,
} from '#/shared/lib/date'

describe('getMonthKey', () => {
  it('extracts yyyy-MM from date string', () => {
    expect(getMonthKey('2026-03-15')).toBe('2026-03')
  })

  it('works with Date objects', () => {
    expect(getMonthKey(new Date(2026, 0, 1))).toBe('2026-01')
  })
})

describe('getMonthLabel', () => {
  it('returns Korean month format', () => {
    expect(getMonthLabel('2026-03-01')).toBe('3월')
    expect(getMonthLabel('2026-12-15')).toBe('12월')
  })
})

describe('formatDateLabel', () => {
  it('formats date in Korean style', () => {
    expect(formatDateLabel('2026-03-15')).toBe('2026. 3. 15')
  })
})

describe('getLast12MonthFrames', () => {
  it('returns 12 frames', () => {
    const frames = getLast12MonthFrames(new Date(2026, 2, 15))
    expect(frames).toHaveLength(12)
  })

  it('starts 11 months ago', () => {
    const frames = getLast12MonthFrames(new Date(2026, 2, 15))
    expect(frames[0].key).toBe('2025-04')
    expect(frames[11].key).toBe('2026-03')
  })

  it('each frame has start and end dates', () => {
    const frames = getLast12MonthFrames(new Date(2026, 2, 15))
    const march = frames[11]
    expect(march.start.getDate()).toBe(1)
    expect(march.end.getDate()).toBe(31)
  })
})

describe('getPreviousMonthKey', () => {
  it('returns previous month', () => {
    expect(getPreviousMonthKey('2026-03')).toBe('2026-02')
  })

  it('crosses year boundary', () => {
    expect(getPreviousMonthKey('2026-01')).toBe('2025-12')
  })
})

describe('getNextMonthKey', () => {
  it('returns next month', () => {
    expect(getNextMonthKey('2026-03')).toBe('2026-04')
  })

  it('crosses year boundary', () => {
    expect(getNextMonthKey('2025-12')).toBe('2026-01')
  })
})
