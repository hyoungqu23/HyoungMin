import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-emerald-200/90 bg-[linear-gradient(180deg,rgba(236,253,245,0.9),rgba(248,250,248,0.86))] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-[border-color,box-shadow,transform] duration-200 hover:border-emerald-300/90 hover:shadow-[0_18px_40px_rgba(35,52,46,0.08)] sm:p-8">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-200/80 bg-white/90 text-emerald-700 shadow-[0_12px_28px_rgba(16,185,129,0.12)]">
        {icon ?? <Sparkles className="size-6" />}
      </div>
      <span className="mt-4 inline-flex rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
        CoupleLine
      </span>
      <h3 className="mt-4 font-display text-[1.9rem] leading-none text-stone-900 sm:text-2xl">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-600">
        {description}
      </p>
      {action ? (
        <div className="mt-5 flex justify-center [&>*]:w-full sm:[&>*]:w-auto">
          {action}
        </div>
      ) : null}
    </div>
  )
}
