import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '#/shared/api/supabase/server'
import { buildDashboardSnapshot } from '#/shared/lib/ledger'
import { logger } from '#/shared/lib/logger'

const spaceIdSchema = z.object({
  spaceId: z.string().uuid(),
})

export const fetchSpaceAccessFn = createServerFn({ method: 'GET' })
  .inputValidator((input) => spaceIdSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const [{ data: membership }, { data: space }] = await Promise.all([
      supabase
        .from('space_members')
        .select('role')
        .eq('space_id', data.spaceId)
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('spaces')
        .select('id, name')
        .eq('id', data.spaceId)
        .maybeSingle(),
    ])

    if (!membership || !space) {
      return null
    }

    return {
      space,
      membership: {
        ...membership,
        role: membership.role ?? 'MEMBER',
      },
    }
  })

export const createSpaceFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        name: z.string().trim().min(2).max(40),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { data: spaceId, error } = await supabase.rpc(
      'create_space_with_owner',
      {
        space_name: data.name,
      },
    )

    if (error) {
      logger.error('space.create', error)
      throw error
    }

    logger.info('space.create', { spaceId: spaceId ?? undefined, detail: data.name })
    return { spaceId }
  })

export const fetchInviteInfoFn = createServerFn({ method: 'GET' })
  .inputValidator((input) =>
    z
      .object({
        spaceId: z.string().uuid(),
        passwordHash: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { data: inviteData, error } = await supabase.rpc(
      'get_space_invite_info',
      {
        target_space_id: data.spaceId,
        hashed_password: data.passwordHash ?? undefined,
      },
    )

    if (error) {
      throw error
    }

    const resolved = (inviteData ?? {}) as {
      space_name?: string | null
      is_direct_link_valid?: boolean
      is_expired?: boolean
    }

    return {
      spaceName: resolved.space_name ?? '우리 공간',
      isDirectLinkValid: Boolean(resolved.is_direct_link_valid),
      isExpired: Boolean(resolved.is_expired),
    }
  })

export const joinSpaceWithInviteFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        spaceId: z.string().uuid(),
        password: z.string().trim().min(1).optional(),
        passwordHash: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { data: joinData, error } = await supabase.rpc(
      'join_space_with_invite',
      {
        target_space_id: data.spaceId,
        plain_password: data.password ?? undefined,
        hashed_password: data.passwordHash ?? undefined,
      },
    )

    if (error) {
      throw error
    }

    const resolved = (joinData ?? {}) as {
      joined?: boolean
      already_member?: boolean
      valid?: boolean
      expired?: boolean
      space_name?: string | null
    }

    const result = {
      joined: Boolean(resolved.joined),
      alreadyMember: Boolean(resolved.already_member),
      valid: Boolean(resolved.valid),
      expired: Boolean(resolved.expired),
      spaceName: resolved.space_name ?? null,
    }

    if (result.joined) {
      logger.info('space.join', { spaceId: data.spaceId })
    } else if (result.expired) {
      logger.warn('space.join.expired', { spaceId: data.spaceId })
    }

    return result
  })

export const createInviteLinkFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        spaceId: z.string().uuid(),
        password: z.string().trim().min(4).max(32),
        expireHours: z.coerce.number().int().min(1).max(720).default(72),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { data: inviteHash, error } = await supabase.rpc(
      'set_space_invite_password',
      {
        target_space_id: data.spaceId,
        plain_password: data.password,
        expire_hours: data.expireHours,
      },
    )

    if (error) {
      logger.error('space.invite.create', error, { spaceId: data.spaceId })
      throw error
    }

    logger.info('space.invite.create', { spaceId: data.spaceId, detail: `expires in ${data.expireHours}h` })
    return { inviteHash }
  })

export async function fetchSpaceLedgerData(spaceId: string) {
  const supabase = await getSupabaseServerClient()
  const [{ data: accounts }, { data: categories }, { data: transactions }] =
    await Promise.all([
      supabase
        .from('accounts')
        .select('*')
        .eq('space_id', spaceId)
        .order('type', { ascending: true })
        .order('created_at', { ascending: true }),
      supabase
        .from('categories')
        .select('*')
        .eq('space_id', spaceId)
        .order('type', { ascending: true })
        .order('name', { ascending: true }),
      supabase
        .from('transactions')
        .select('*')
        .eq('space_id', spaceId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false }),
    ])

  return {
    accounts: accounts ?? [],
    categories: categories ?? [],
    transactions: transactions ?? [],
  }
}

export const fetchDashboardDataFn = createServerFn({ method: 'GET' })
  .inputValidator((input) => spaceIdSchema.parse(input))
  .handler(async ({ data }) => {
    const ledger = await fetchSpaceLedgerData(data.spaceId)
    return buildDashboardSnapshot(ledger)
  })
