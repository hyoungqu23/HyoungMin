import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '#/shared/api/supabase/server'
import { logger } from '#/shared/lib/logger'

export const fetchMembersPageDataFn = createServerFn({ method: 'GET' })
  .inputValidator((input) =>
    z.object({ spaceId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { data: members, error } = await supabase
      .from('space_members')
      .select('space_id, user_id, role, joined_at')
      .eq('space_id', data.spaceId)
      .order('joined_at', { ascending: true })

    if (error) {
      throw error
    }

    const userIds = members.map((member) => member.user_id)
    const { data: profiles } = userIds.length
      ? await supabase.from('user_profiles').select('*').in('id', userIds)
      : {
          data: [] as Array<{
            id: string
            email: string
            name: string
            avatar_url: string | null
          }>,
        }

    const resolvedProfiles = profiles ?? []

    return {
      members: members.map((member) => ({
        ...member,
        joined_at: member.joined_at ?? '',
        role: member.role ?? 'MEMBER',
        profile:
          resolvedProfiles.find((profile) => profile.id === member.user_id) ??
          null,
      })),
    }
  })

export const updateMemberRoleFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        spaceId: z.string().uuid(),
        userId: z.string().uuid(),
        role: z.enum(['OWNER', 'MANAGER', 'MEMBER']),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.rpc('update_space_member_role', {
      target_space_id: data.spaceId,
      target_user_id: data.userId,
      next_role: data.role,
    })

    if (error) {
      logger.error('member.role.update', error, { spaceId: data.spaceId })
      throw error
    }

    logger.info('member.role.update', { spaceId: data.spaceId, userId: data.userId, detail: data.role })
    return { success: true }
  })
