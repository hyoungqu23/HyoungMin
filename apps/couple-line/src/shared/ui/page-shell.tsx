import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '#/shared/lib/utils'

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
}: PropsWithChildren<{
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}>) {
  return (
    <section className={cn('space-y-4 sm:space-y-6', className)}>
      <header className="flex flex-col gap-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-4 shadow-[0_24px_80px_rgba(29,53,47,0.08)] backdrop-blur sm:rounded-[2rem] sm:p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700/70 sm:text-xs sm:tracking-[0.28em]">
            CoupleLine
          </p>
          <div>
            <h1 className="font-display text-[2rem] leading-none text-stone-900 sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end [&>*]:w-full sm:[&>*]:w-auto">
            {actions}
          </div>
        ) : null}
      </header>
      {children}
    </section>
  )
}
