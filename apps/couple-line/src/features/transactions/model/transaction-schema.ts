import { z } from 'zod'

const nullableUuid = z.string().uuid().optional().or(z.literal(''))

export const transactionSchema = z
  .object({
    date: z.string().min(1, '일자를 입력해 주세요.'),
    type: z.enum(['수입', '지출', '이체']),
    amount: z.coerce.number(),
    memo: z.string().optional().default(''),
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
