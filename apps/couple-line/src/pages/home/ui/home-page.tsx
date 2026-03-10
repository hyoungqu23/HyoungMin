import { Link } from '@tanstack/react-router'
import type { Viewer } from '#/app/providers/viewer-provider'
import { CreateSpaceForm } from '#/features/spaces/create-space-form'
import { EmptyState } from '#/shared/ui/empty-state'

export function HomePage({ viewer }: { viewer: Viewer }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:py-10 lg:px-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/88 p-5 shadow-[0_28px_80px_rgba(26,44,39,0.08)] sm:rounded-[2.5rem] sm:p-8 xl:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700/70 sm:text-xs sm:tracking-[0.28em]">
          Welcome back
        </p>
        <h1 className="mt-4 font-display text-[2.8rem] leading-[0.94] text-stone-900 sm:text-5xl">
          {viewer.name}님의 CoupleLine
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
          여러 공간을 관리 중이라면 아래에서 바로 이동할 수 있고, 새 커플 공간을
          하나 더 만들 수도 있어요.
        </p>
      </section>

      <section className="mt-5 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_60px_rgba(35,52,46,0.08)] sm:rounded-[2rem] sm:p-6">
          <h2 className="font-display text-[2rem] leading-none text-stone-900 sm:text-3xl">
            참여 중인 공간
          </h2>
          {viewer.spaces.length ? (
            <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
              {viewer.spaces.map((space) => (
                <Link
                  key={space.id}
                  to="/$spaceId"
                  params={{ spaceId: space.id }}
                  className="rounded-[1.35rem] border border-stone-100 bg-stone-50/80 p-4 no-underline transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white sm:rounded-[1.5rem] sm:p-5"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-700/70 sm:text-xs sm:tracking-[0.24em]">
                    {space.role}
                  </p>
                  <h3 className="mt-3 font-display text-[1.7rem] leading-none text-stone-900 sm:text-2xl">
                    {space.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-500">
                    대시보드 · 거래 · 카테고리 · 계정 관리로 이동
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="아직 참여 중인 공간이 없어요"
                description="새 공간을 만들거나 초대 링크를 열어 커플 공간에 합류해 보세요."
              />
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_18px_60px_rgba(35,52,46,0.08)] sm:rounded-[2rem] sm:p-6">
          <h2 className="font-display text-[2rem] leading-none text-stone-900 sm:text-3xl">
            새 공간 만들기
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            아직 커플 공간이 없다면 지금 바로 첫 워크스페이스를 생성하세요. 생성
            즉시 OWNER 권한으로 연결됩니다.
          </p>
          <div className="mt-6">
            <CreateSpaceForm />
          </div>
        </div>
      </section>
    </main>
  )
}
