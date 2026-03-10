import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '#/shared/lib/utils'
import { Badge } from '#/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/shared/ui/card'

export function MetricCard({
  title,
  value,
  meta,
  tone = 'default',
  icon,
}: {
  title: string
  value: string
  meta?: string
  tone?: 'default' | 'success' | 'danger'
  icon?: ReactNode
}) {
  return (
    <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(35,52,46,0.08)]">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 px-4 pb-3 pt-5 sm:px-6 sm:pt-6">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-stone-500 sm:text-sm sm:tracking-normal">
            {title}
          </p>
          <CardTitle className="mt-2 break-keep font-display text-[1.6rem] leading-none text-stone-900 sm:text-2xl">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-700 sm:p-3">
          {icon}
        </div>
      </CardHeader>
      {meta ? (
        <CardContent className="px-4 pb-5 sm:px-6">
          <Badge
            variant="secondary"
            className={cn(
              'rounded-full px-3 py-1 text-[11px] font-medium sm:text-xs',
              tone === 'success' &&
                'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
              tone === 'danger' &&
                'bg-rose-100 text-rose-700 hover:bg-rose-100',
            )}
          >
            {tone === 'success' ? (
              <ArrowUpRight className="size-3.5" />
            ) : tone === 'danger' ? (
              <ArrowDownRight className="size-3.5" />
            ) : null}
            {meta}
          </Badge>
        </CardContent>
      ) : null}
    </Card>
  )
}
