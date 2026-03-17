import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#/shared/api/supabase/database.types'

export async function requireAuth(
  supabase: SupabaseClient<Database>,
): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('로그인이 필요합니다.')
  }

  return user.id
}

export async function requireSpaceMember(
  supabase: SupabaseClient<Database>,
  spaceId: string,
): Promise<string> {
  const userId = await requireAuth(supabase)

  const { data: membership } = await supabase
    .from('space_members')
    .select('role')
    .eq('space_id', spaceId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!membership) {
    throw new Error('이 공간에 대한 접근 권한이 없어요.')
  }

  return userId
}
