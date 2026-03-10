import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Viewer } from '#/app/providers/viewer-provider'
import { getSupabaseServerClient } from '#/shared/api/supabase/server'

export const fetchViewerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const [{ data: profile }, { data: memberships }] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('space_members')
        .select('space_id, role')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: true }),
    ])

    const spaceIds = memberships?.map((membership) => membership.space_id) ?? []
    const { data: spaces } = spaceIds.length
      ? await supabase
          .from('spaces')
          .select('id, name')
          .in('id', spaceIds)
          .order('created_at', { ascending: true })
      : { data: [] as Array<{ id: string; name: string }> }

    const viewer: Viewer = {
      id: user.id,
      email: profile?.email ?? user.email ?? '',
      name:
        profile?.name ??
        (user.user_metadata.name as string | undefined) ??
        user.email?.split('@')[0] ??
        '사용자',
      avatarUrl:
        profile?.avatar_url ??
        (user.user_metadata.avatar_url as string | undefined) ??
        null,
      spaces: (memberships ?? []).map((membership) => ({
        id: membership.space_id,
        name:
          spaces?.find((space) => space.id === membership.space_id)?.name ??
          '이름 없는 공간',
        role: membership.role ?? 'MEMBER',
      })),
    }

    return viewer
  },
)

export const exchangeOAuthCodeFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        code: z.string().min(1),
        next: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(data.code)

    if (error) {
      throw redirect({ to: '/login' })
    }

    return {
      next: data.next && data.next.startsWith('/') ? data.next : '/',
    }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()

  throw redirect({ to: '/login' })
})
