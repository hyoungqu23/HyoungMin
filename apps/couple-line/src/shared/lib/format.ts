export function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return value
  }

  if (!value) {
    return 0
  }

  return Number(value)
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    notation: 'compact',
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return '—'
  }

  return `${value.toFixed(1)}%`
}

export function formatSignedPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return '—'
  }

  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}
