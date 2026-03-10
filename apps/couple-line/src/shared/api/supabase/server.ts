import { createServerClient } from '@supabase/ssr'
import { env } from '#/shared/config/env'
import type { Database } from '#/shared/api/supabase/database.types'

export async function getSupabaseServerClient() {
  const { getCookies, setCookie } = await import('@tanstack/react-start/server')

  return createServerClient<Database>(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value, cookie.options)
          })
        },
      },
    },
  )
}
