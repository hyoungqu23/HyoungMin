import { createBrowserClient } from '@supabase/ssr'
import { env } from '#/shared/config/env'
import type { Database } from '#/shared/api/supabase/database.types'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      env.VITE_SUPABASE_URL,
      env.VITE_SUPABASE_ANON_KEY,
    )
  }

  return browserClient
}
