import { ArrowRight } from 'lucide-react'
import { GoogleSignInButton } from '#/features/auth/google-sign-in-button'

export function LoginPage({ redirectTo }: { redirectTo?: string }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-start px-4 py-6 sm:py-10 lg:items-center lg:px-8">
      <div className="grid w-full gap-5 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <section className="order-2 rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(242,249,244,0.76))] p-5 shadow-[0_28px_80px_rgba(26,44,39,0.10)] backdrop-blur sm:rounded-[2.5rem] sm:p-8 xl:p-12 lg:order-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700/70 sm:text-xs sm:tracking-[0.32em]">
            Couple bookkeeping, without the chaos
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-[2.8rem] leading-[0.92] text-stone-900 sm:mt-6 sm:text-5xl xl:text-7xl">
            둘의 돈 흐름을
            <br />
            하나의 장부로.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:mt-6 sm:text-base sm:leading-8 xl:text-lg">
            CoupleLine은 커플을 위한 복식부기 가계부입니다. 계좌·카테고리·거래를
            공간 단위로 묶고, 환불/대납 정산 같은 마이너스 지출도 자연스럽게
            관리할 수 있어요.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5 text-sm text-stone-500 sm:mt-10 sm:gap-3">
            {[
              '실시간 순자산 계산',
              '자산 성격별 포트폴리오',
              'Google OAuth 로그인',
              '커플 전용 공간 초대',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/70 bg-white/70 px-3 py-2 sm:px-4"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="order-1 rounded-[2rem] border border-stone-200/70 bg-white/88 p-5 shadow-[0_28px_80px_rgba(26,44,39,0.08)] sm:rounded-[2.5rem] sm:p-8 xl:p-10 lg:order-2">
          <p className="text-sm font-medium text-stone-500">시작하려면</p>
          <h2 className="mt-2 font-display text-[2rem] leading-none text-stone-900 sm:text-3xl">
            Google 계정으로 로그인하세요.
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            최초 로그인 시 프로필이 자동 생성되고, 이미 받은 초대 링크가 있으면
            로그인 후 바로 해당 공간으로 이동합니다.
          </p>
          <div className="mt-6 sm:mt-8">
            <GoogleSignInButton redirectTo={redirectTo} />
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-stone-900 p-5 text-white sm:mt-8 sm:rounded-[1.75rem] sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60 sm:tracking-[0.28em]">
              What happens next
            </p>
            <ol className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0" /> 로그인 후 기존
                공간이 있으면 바로 대시보드로 이동
              </li>
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0" /> 공간이 없으면
                첫 커플 공간을 생성
              </li>
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0" /> 초대 링크라면
                비밀번호 검증 후 자동 합류
              </li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  )
}
