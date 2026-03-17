type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  action: string
  spaceId?: string
  userId?: string
  detail?: string
  durationMs?: number
}

function formatEntry(entry: LogEntry) {
  const parts = [
    `[${entry.level.toUpperCase()}]`,
    entry.action,
  ]

  if (entry.spaceId) parts.push(`space=${entry.spaceId}`)
  if (entry.userId) parts.push(`user=${entry.userId}`)
  if (entry.durationMs !== undefined) parts.push(`${entry.durationMs}ms`)
  if (entry.detail) parts.push(`- ${entry.detail}`)

  return parts.join(' ')
}

export const logger = {
  info(action: string, meta?: Omit<LogEntry, 'level' | 'action'>) {
    console.info(formatEntry({ level: 'info', action, ...meta }))
  },

  warn(action: string, meta?: Omit<LogEntry, 'level' | 'action'>) {
    console.warn(formatEntry({ level: 'warn', action, ...meta }))
  },

  error(action: string, error: unknown, meta?: Omit<LogEntry, 'level' | 'action'>) {
    const detail =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error)

    console.error(formatEntry({ level: 'error', action, detail, ...meta }))
  },
}
