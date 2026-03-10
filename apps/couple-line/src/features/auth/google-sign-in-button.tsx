import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { getErrorMessage } from '#/shared/lib/error'
import { Button } from '#/shared/ui/button'
import { getSupabaseBrowserClient } from '#/shared/api/supabase/browser'

export function GoogleSignInButton({ redirectTo }: { redirectTo?: string }) {
  const [isPending, setIsPending] = useState(false)

  async function signIn() {
    setIsPending(true)
    const supabase = getSupabaseBrowserClient()
    const next = redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback${next}`,
      },
    })

    if (error) {
      setIsPending(false)
      toast.error('Google 로그인을 시작하지 못했어요.', {
        description: getErrorMessage(error),
      })
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      className="h-11 w-full rounded-full bg-stone-900 px-6 text-white hover:bg-stone-800 sm:w-auto"
      onClick={signIn}
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : null}
      Google로 시작하기
    </Button>
  )
}
