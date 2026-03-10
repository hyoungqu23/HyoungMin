import { ArrowRight } from 'lucide-react'
import type { Viewer } from '#/app/providers/viewer-provider'
import { GoogleSignInButton } from '#/features/auth/google-sign-in-button'
import { JoinSpaceForm } from '#/features/spaces/join-space-form'

export function SpaceInvitePage({
  viewer,
  redirectTo,
  spaceName,
  hasDirectLink,
  spaceId,
}: {
  viewer: Viewer | null
  redirectTo: string
  spaceName: string
  hasDirectLink: boolean
  spaceId: string
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-start px-4 py-6 sm:py-10 lg:items-center lg:px-8">
      <div className="grid w-full gap-5 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <section className="order-2 rounded-[2rem] border border-white/70 bg-white/88 p-5 shadow-[0_28px_80px_rgba(26,44,39,0.08)] sm:rounded-[2.5rem] sm:p-8 xl:p-12 lg:order-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700/70 sm:text-xs sm:tracking-[0.28em]">
            Invite
          </p>
          <h1 className="mt-4 font-display text-[2.8rem] leading-[0.94] text-stone-900 sm:text-5xl">
            {spaceName}에 초대되었어요.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            CoupleLine 공간에 참여하면 거래 내역, 자산 포트폴리오, 계정과
            카테고리를 함께 관리할 수 있어요.
          </p>
          <div className="mt-6 rounded-[1.5rem] bg-stone-900 p-5 text-white sm:mt-8 sm:rounded-[1.75rem] sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60 sm:tracking-[0.28em]">
              초대 규칙
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0" /> 링크에 암호
                해시가 있으면 로그인 직후 자동 검증됩니다.
              </li>
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0" /> 암호가 없거나
                유효하지 않다면 수동 비밀번호 입력으로 합류할 수 있어요.
              </li>
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0" /> 합류 즉시 해당
                공간의 메인 대시보드로 이동합니다.
              </li>
            </ul>
          </div>
        </section>

        <section className="order-1 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_28px_80px_rgba(26,44,39,0.08)] sm:rounded-[2.5rem] sm:p-8 xl:p-10 lg:order-2">
          {viewer ? (
            <>
              <p className="text-sm text-stone-500">현재 로그인됨</p>
              <h2 className="mt-2 font-display text-[2rem] leading-none text-stone-900 sm:text-3xl">
                {viewer.name}님, 공간에 합류할까요?
              </h2>
              {hasDirectLink ? (
                <div className="mt-6 rounded-[1.35rem] border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-800 sm:rounded-[1.6rem]">
                  링크 검증에 성공했어요. 잠시 후 자동으로 공간에 추가됩니다.
                </div>
              ) : (
                <div className="mt-6">
                  <JoinSpaceForm spaceId={spaceId} />
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-stone-500">먼저 로그인해 주세요</p>
              <h2 className="mt-2 font-display text-[2rem] leading-none text-stone-900 sm:text-3xl">
                Google 로그인 후 바로 합류할 수 있어요.
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                로그인 후 다시 이 초대 링크로 돌아와 자동 검증을 이어갑니다.
              </p>
              <div className="mt-6 sm:mt-8">
                <GoogleSignInButton redirectTo={redirectTo} />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
