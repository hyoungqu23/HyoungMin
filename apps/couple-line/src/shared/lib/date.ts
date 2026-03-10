import {
  addMonths,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale'

export function getMonthKey(date: string | Date) {
  const resolved = typeof date === 'string' ? parseISO(date) : date
  return format(resolved, 'yyyy-MM')
}

export function getMonthLabel(date: string | Date) {
  const resolved = typeof date === 'string' ? parseISO(date) : date
  return format(resolved, 'M월', { locale: ko })
}

export function formatDateLabel(date: string) {
  return format(parseISO(date), 'yyyy. M. d', { locale: ko })
}

export function getLast12MonthFrames(anchor = new Date()) {
  return Array.from({ length: 12 }, (_, index) => {
    const date = subMonths(startOfMonth(anchor), 11 - index)
    return {
      key: getMonthKey(date),
      label: getMonthLabel(date),
      start: startOfMonth(date),
      end: endOfMonth(date),
    }
  })
}

export function getPreviousMonthKey(monthKey: string) {
  return getMonthKey(subMonths(parseISO(`${monthKey}-01`), 1))
}

export function getNextMonthKey(monthKey: string) {
  return getMonthKey(addMonths(parseISO(`${monthKey}-01`), 1))
}
