import { cn } from '#/shared/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'relative overflow-hidden rounded-md bg-stone-200/80',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_linear_infinite]',
        'before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)]',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
