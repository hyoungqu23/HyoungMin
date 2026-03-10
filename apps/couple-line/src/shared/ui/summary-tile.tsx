import { cn } from '#/shared/lib/utils'

export function SummaryTile({
  label,
  value,
  description,
  tone = 'default',
}: {
  label: string
  value: string
  description?: string
  tone?: 'default' | 'success' | 'sky' | 'amber'
}) {
  return (
    <div
      className={cn(
        'rounded-[1.5rem] border bg-white/82 p-4 shadow-[0_18px_50px_rgba(35,52,46,0.06)] backdrop-blur-sm sm:p-5',
        tone === 'default' && 'border-white/70',
        tone === 'success' && 'border-emerald-100 bg-emerald-50/75',
        tone === 'sky' && 'border-sky-100 bg-sky-50/75',
        tone === 'amber' && 'border-amber-100 bg-amber-50/80',
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-display text-[2rem] leading-none text-stone-900">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      ) : null}
    </div>
  )
}
