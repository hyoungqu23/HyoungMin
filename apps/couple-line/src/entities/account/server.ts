import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { fetchSpaceLedgerData } from '#/entities/space/server'
import { buildDashboardSnapshot } from '#/shared/lib/ledger'
import { getSupabaseServerClient } from '#/shared/api/supabase/server'
import { requireSpaceMember } from '#/shared/api/supabase/auth-guard'
import { logger } from '#/shared/lib/logger'

const accountSchema = z.object({
  id: z.string().uuid().optional(),
  spaceId: z.string().uuid(),
  name: z.string().trim().min(1).max(40),
  type: z.enum(['자산', '부채']),
  subType: z.string().trim().max(20).optional(),
  assetGroup: z.string().trim().max(20).optional(),
  owner: z.string().trim().max(20).optional(),
  initialBalance: z.coerce.number(),
})

export const fetchAccountsPageDataFn = createServerFn({ method: 'GET' })
  .inputValidator((input) =>
    z.object({ spaceId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const ledger = await fetchSpaceLedgerData(data.spaceId)
    const snapshot = buildDashboardSnapshot(ledger)

    return {
      rows: snapshot.accountRows,
      accounts: ledger.accounts,
    }
  })

export const upsertAccountFn = createServerFn({ method: 'POST' })
  .inputValidator((input) => accountSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    await requireSpaceMember(supabase, data.spaceId)

    const payload = {
      space_id: data.spaceId,
      name: data.name,
      type: data.type,
      sub_type: data.subType || null,
      asset_group:
        data.type === '자산' ? data.assetGroup || '미분류 자산' : null,
      owner: data.owner || null,
      initial_balance: data.initialBalance,
    }

    const query = data.id
      ? supabase
          .from('accounts')
          .update(payload)
          .eq('id', data.id)
          .eq('space_id', data.spaceId)
      : supabase.from('accounts').insert(payload)

    const { error } = await query

    if (error) {
      logger.error('account.upsert', error, { spaceId: data.spaceId })
      throw error
    }

    logger.info('account.upsert', { spaceId: data.spaceId, detail: `${data.id ? 'update' : 'create'} ${data.name}` })
    return { success: true }
  })

export const deleteAccountFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        spaceId: z.string().uuid(),
        accountId: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    await requireSpaceMember(supabase, data.spaceId)

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', data.accountId)
      .eq('space_id', data.spaceId)

    if (error) {
      logger.error('account.delete', error, { spaceId: data.spaceId })
      throw error
    }

    logger.info('account.delete', { spaceId: data.spaceId, detail: data.accountId })
    return { success: true }
  })
