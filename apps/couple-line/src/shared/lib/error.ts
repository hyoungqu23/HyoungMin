const POSTGRES_CODE_MAP: Record<string, string> = {
  '23503': '연결된 거래나 데이터가 있어 지금은 처리할 수 없어요.',
  '23505': '이미 같은 값이 있어요. 이름이나 설정을 다시 확인해 주세요.',
  '23514': '입력한 값 조합이 CoupleLine 장부 규칙과 맞지 않아요.',
  '42501': '이 공간을 수정할 권한이 없어요.',
  PGRST301: '로그인이 만료되었어요. 다시 로그인해 주세요.',
}

function normalizeErrorMessage(message: string) {
  const trimmed = message.trim()
  const lower = trimmed.toLowerCase()

  if (lower.includes('row-level security')) {
    return '이 공간을 수정할 권한이 없어요.'
  }

  if (
    lower.includes('violates foreign key constraint') ||
    lower.includes('foreign key')
  ) {
    return '연결된 거래나 데이터가 있어 지금은 처리할 수 없어요.'
  }

  if (lower.includes('duplicate key')) {
    return '이미 같은 값이 있어요. 이름이나 설정을 다시 확인해 주세요.'
  }

  if (lower.includes('check constraint')) {
    return '입력한 값 조합이 CoupleLine 장부 규칙과 맞지 않아요.'
  }

  if (lower.includes('jwt expired') || lower.includes('token is expired')) {
    return '로그인이 만료되었어요. 다시 로그인해 주세요.'
  }

  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
  }

  if (lower.includes('timeout') || lower.includes('timed out')) {
    return '서버 응답이 너무 느려요. 잠시 후 다시 시도해 주세요.'
  }

  return trimmed
}

export function getErrorMessage(
  error: unknown,
  fallback = '잠시 후 다시 시도해 주세요.',
) {
  if (typeof error === 'string' && error.trim()) {
    return normalizeErrorMessage(error)
  }

  if (error instanceof Error && error.message.trim()) {
    return normalizeErrorMessage(error.message)
  }

  if (error && typeof error === 'object') {
    const record = error as Record<string, unknown>

    // Supabase/PostgREST error code handling
    const code = record['code']
    if (typeof code === 'string' && code in POSTGRES_CODE_MAP) {
      return POSTGRES_CODE_MAP[code]
    }

    const candidateKeys = [
      'message',
      'error_description',
      'details',
      'hint',
    ] as const

    for (const key of candidateKeys) {
      const value = record[key]

      if (typeof value === 'string' && value.trim()) {
        return normalizeErrorMessage(value)
      }
    }
  }

  return fallback
}
