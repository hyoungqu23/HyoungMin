import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { fetchSpaceLedgerData } from '#/entities/space/server'
import { buildDashboardSnapshot } from '#/shared/lib/ledger'
import { getSupabaseServerClient } from '#/shared/api/supabase/server'

const nullableUuid = z.string().uuid().optional().or(z.literal(''))

const transactionSchema = z
  .object({
    spaceId: z.string().uuid(),
    date: z.string().min(1),
    type: z.enum(['수입', '지출', '이체']),
    amount: z.coerce.number(),
    memo: z.string().trim().max(120).optional(),
    fromAccountId: nullableUuid,
    fromCategoryId: nullableUuid,
    toAccountId: nullableUuid,
    toCategoryId: nullableUuid,
  })
  .superRefine((value, ctx) => {
    if (value.type === '수입') {
      if (!value.fromCategoryId) {
        ctx.addIssue({
          code: 'custom',
          path: ['fromCategoryId'],
          message: '수입 카테고리를 선택해 주세요.',
        })
      }
      if (!value.toAccountId) {
        ctx.addIssue({
          code: 'custom',
          path: ['toAccountId'],
          message: '입금 계좌를 선택해 주세요.',
        })
      }
    }

    if (value.type === '지출') {
      if (!value.fromAccountId) {
        ctx.addIssue({
          code: 'custom',
          path: ['fromAccountId'],
          message: '출금 계좌를 선택해 주세요.',
        })
      }
      if (!value.toCategoryId) {
        ctx.addIssue({
          code: 'custom',
          path: ['toCategoryId'],
          message: '지출 카테고리를 선택해 주세요.',
        })
      }
    }

    if (value.type === '이체') {
      if (!value.fromAccountId) {
        ctx.addIssue({
          code: 'custom',
          path: ['fromAccountId'],
          message: '보내는 계좌를 선택해 주세요.',
        })
      }
      if (!value.toAccountId) {
        ctx.addIssue({
          code: 'custom',
          path: ['toAccountId'],
          message: '받는 계좌를 선택해 주세요.',
        })
      }
      if (value.fromAccountId && value.fromAccountId === value.toAccountId) {
        ctx.addIssue({
          code: 'custom',
          path: ['toAccountId'],
          message: '서로 다른 계좌를 선택해 주세요.',
        })
      }
    }
  })

export const fetchTransactionsPageDataFn = createServerFn({ method: 'GET' })
  .inputValidator((input) =>
    z.object({ spaceId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const ledger = await fetchSpaceLedgerData(data.spaceId)
    const snapshot = buildDashboardSnapshot(ledger)

    return {
      rows: snapshot.transactionRows,
      accounts: ledger.accounts,
      categories: ledger.categories,
    }
  })

export const createTransactionFn = createServerFn({ method: 'POST' })
  .inputValidator((input) => transactionSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      throw authError
    }

    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    const { error } = await supabase.from('transactions').insert({
      space_id: data.spaceId,
      user_id: user.id,
      date: data.date,
      type: data.type,
      amount: data.amount,
      memo: data.memo || null,
      from_account_id: data.fromAccountId || null,
      from_category_id: data.fromCategoryId || null,
      to_account_id: data.toAccountId || null,
      to_category_id: data.toCategoryId || null,
    })

    if (error) {
      throw error
    }

    return { success: true }
  })

export const deleteTransactionFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        spaceId: z.string().uuid(),
        transactionId: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', data.transactionId)
      .eq('space_id', data.spaceId)

    if (error) {
      throw error
    }

    return { success: true }
  })
