import { Skeleton } from '#/shared/ui/skeleton'

function HeaderSkeleton({ showAction = true }: { showAction?: boolean }) {
  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="flex flex-col gap-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-4 shadow-[0_24px_80px_rgba(29,53,47,0.08)] backdrop-blur sm:rounded-[2rem] sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="min-w-0 space-y-3">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-10 w-44 sm:w-60" />
          <Skeleton className="h-4 w-full max-w-2xl sm:w-[26rem]" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
        </div>
        {showAction ? (
          <Skeleton className="h-11 w-full rounded-full sm:w-40" />
        ) : null}
      </header>
    </section>
  )
}

function SummaryRow({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-[1.5rem] border border-white/70 bg-white/82 p-4 shadow-[0_18px_50px_rgba(35,52,46,0.06)] sm:p-5"
        >
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="mt-3 h-9 w-28 sm:w-36" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,248,0.88))] p-4 shadow-[0_18px_60px_rgba(35,52,46,0.08)] sm:p-5">
      <div className="grid grid-cols-4 gap-3 border-b border-stone-100 pb-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-20" />
        ))}
      </div>
      <div className="space-y-3 pt-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-[1.1rem] border border-stone-100/80 bg-white/80 p-4 md:grid-cols-4"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24 md:ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <HeaderSkeleton showAction={false} />
      <Skeleton className="h-11 w-full rounded-[1rem] sm:w-72" />
      <SummaryRow />
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr] xl:gap-6">
        <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_60px_rgba(35,52,46,0.08)] sm:p-6">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          <div className="mt-5 rounded-[1.4rem] border border-stone-100 bg-stone-50/70 p-3">
            <Skeleton className="h-[280px] w-full sm:h-[360px]" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.2rem] border border-white/80 bg-stone-50/75 p-4"
              >
                <Skeleton className="h-3 w-16 rounded-full" />
                <Skeleton className="mt-3 h-8 w-24" />
                <Skeleton className="mt-3 h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_60px_rgba(35,52,46,0.08)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-60 max-w-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-full sm:w-32" />
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-3">
              <Skeleton className="h-[240px] w-full rounded-[1.5rem] sm:h-[270px]" />
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-20 w-full rounded-[1.2rem]"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-24 w-full rounded-[1.25rem]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_60px_rgba(35,52,46,0.08)] sm:p-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
        <div className="mt-5 space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
              <TableSkeleton rows={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CollectionPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <HeaderSkeleton />
      <SummaryRow />
      <TableSkeleton rows={6} />
    </div>
  )
}

export function TransactionsPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <HeaderSkeleton showAction={false} />
      <SummaryRow />

      <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_60px_rgba(35,52,46,0.08)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={
                index === 3
                  ? 'sm:col-span-2 xl:col-span-3'
                  : index === 5
                    ? 'sm:col-span-2 xl:col-span-2'
                    : ''
              }
            >
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-2 h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      <TableSkeleton rows={6} />
    </div>
  )
}
