import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, LogOut } from 'lucide-react'
import { useViewer } from '#/app/providers/viewer-provider'
import { SPACE_NAV_ITEMS } from '#/shared/lib/constants'
import { Avatar, AvatarFallback, AvatarImage } from '#/shared/ui/avatar'
import { Badge } from '#/shared/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/shared/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/ui/select'
import { cn } from '#/shared/lib/utils'
import { useSpace } from '#/widgets/app-shell/space-context'

export function SpaceShell({ children }: { children: React.ReactNode }) {
  const viewer = useViewer()
  const navigate = useNavigate()
  const { space, membership } = useSpace()

  return (
    <div className="min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-12">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[rgba(253,251,247,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 space-y-1.5">
              <Link
                to="/"
                className="inline-flex max-w-full items-center gap-3 no-underline"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 font-display text-base text-white shadow-lg shadow-stone-900/10 sm:size-11 sm:text-lg">
                  C
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl text-stone-900 sm:text-2xl">
                    CoupleLine
                  </p>
                  <p className="hidden text-[11px] uppercase tracking-[0.24em] text-emerald-700/70 sm:block">
                    Couple double-entry bookkeeping
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {viewer && viewer.spaces.length ? (
                <Select
                  value={space.id}
                  onValueChange={async (value) => {
                    await navigate({
                      to: '/$spaceId',
                      params: { spaceId: value },
                    })
                  }}
                >
                  <SelectTrigger className="w-full rounded-full bg-white/90 px-4 text-sm sm:min-w-[240px] sm:w-auto">
                    <SelectValue placeholder="공간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {viewer.spaces.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}

              {viewer ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex w-full items-center gap-3 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-left shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-[1px] hover:border-emerald-200 hover:bg-white hover:shadow-[0_14px_32px_rgba(35,52,46,0.10)] sm:w-auto">
                    <Avatar className="size-9 shrink-0 border border-white/80">
                      <AvatarImage
                        src={viewer.avatarUrl ?? undefined}
                        alt={viewer.name}
                      />
                      <AvatarFallback>{viewer.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 sm:w-40">
                      <p className="truncate text-sm font-semibold text-stone-900">
                        {viewer.name}
                      </p>
                      <p className="truncate text-xs text-stone-500">
                        {viewer.email}
                      </p>
                    </div>
                    <ChevronDown className="size-4 shrink-0 text-stone-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/logout"
                        className="flex w-full items-center gap-2 no-underline"
                      >
                        <LogOut className="size-4" /> 로그아웃
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="max-w-full rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
              <span className="truncate">{space.name}</span>
            </Badge>
            <Badge className="rounded-full bg-stone-100 px-3 py-1 text-stone-700 hover:bg-stone-100">
              {membership.role}
            </Badge>
          </div>

          <nav className="-mx-1 overflow-x-auto px-1 pb-1 no-scrollbar">
            <div className="flex min-w-max gap-2">
              {SPACE_NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  params={{ spaceId: space.id }}
                  activeOptions={
                    item.to === '/$spaceId' ? { exact: true } : undefined
                  }
                  activeProps={{
                    className:
                      'rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white no-underline shadow-[0_14px_32px_rgba(28,25,23,0.18)]',
                  }}
                  className={cn(
                    'shrink-0 rounded-full border border-white/70 bg-white/85 px-4 py-2.5 text-sm font-medium text-stone-600 no-underline transition-[transform,box-shadow,border-color,color,background-color] duration-200',
                    'hover:-translate-y-[1px] hover:border-emerald-200 hover:bg-white hover:text-stone-900 hover:shadow-[0_12px_28px_rgba(35,52,46,0.10)]',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  )
}
