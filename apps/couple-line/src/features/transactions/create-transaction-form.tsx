import { useMemo } from 'react'
import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import {
  ArrowLeftRight,
  CircleMinus,
  CirclePlus,
  LoaderCircle,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { createTransactionFn } from '#/entities/transaction/server'
import { transactionSchema } from '#/features/transactions/model/transaction-schema'
import type { Database } from '#/shared/api/supabase/database.types'
import { TRANSACTION_TYPES } from '#/shared/lib/constants'
import { getErrorMessage } from '#/shared/lib/error'
import { Button } from '#/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/shared/ui/card'
import { Input } from '#/shared/ui/input'
import { Label } from '#/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/ui/select'
import { Textarea } from '#/shared/ui/textarea'

type AccountRow = Database['public']['Tables']['accounts']['Row']
type CategoryRow = Database['public']['Tables']['categories']['Row']
type TransactionFormInput = z.input<typeof transactionSchema>
type TransactionFormOutput = z.output<typeof transactionSchema>

const typeMeta = {
  수입: {
    label: '수입',
    icon: CirclePlus,
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  지출: {
    label: '지출',
    icon: CircleMinus,
    tone: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  이체: {
    label: '이체',
    icon: ArrowLeftRight,
    tone: 'bg-sky-50 text-sky-700 border-sky-100',
  },
} as const

export function CreateTransactionForm({
  spaceId,
  accounts,
  categories,
}: {
  spaceId: string
  accounts: AccountRow[]
  categories: CategoryRow[]
}) {
  const router = useRouter()
  const createTransaction = useServerFn(createTransactionFn)
  const form = useForm<TransactionFormInput, unknown, TransactionFormOutput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      type: '지출',
      amount: 0,
      memo: '',
      fromAccountId: '',
      fromCategoryId: '',
      toAccountId: '',
      toCategoryId: '',
    },
  })

  const type = form.watch('type')
  const activeType = typeMeta[type]
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: `${account.name} · ${account.type}`,
  }))
  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === '수입'),
    [categories],
  )
  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === '지출'),
    [categories],
  )

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      const currentType = form.getValues('type')
      const currentAmount = Number(form.getValues('amount'))

      toast.success('거래를 저장했어요.', {
        description: getTransactionFeedback(currentType, currentAmount),
      })
      form.reset({
        date: form.getValues('date'),
        type: form.getValues('type'),
        amount: 0,
        memo: '',
        fromAccountId: '',
        fromCategoryId: '',
        toAccountId: '',
        toCategoryId: '',
      })
      await router.invalidate()
    },
    onError: (error) => {
      toast.error('거래를 저장하지 못했어요.', {
        description: getErrorMessage(
          error,
          '입력값과 계정/카테고리 조합을 다시 확인해 주세요.',
        ),
      })
    },
  })

  const TypeIcon = activeType.icon
  const quickGuides = [
    {
      title: '환불 · 정산',
      description: '수입이 아니라 음수 지출로 입력',
    },
    {
      title: '카카오페이',
      description: '이체 후 지출, 두 줄로 분개',
    },
    {
      title: '계좌 이동',
      description: '수입/지출이 아닌 이체로 기록',
    },
  ]

  return (
    <Card className="border-white/70 bg-white/88 shadow-[0_18px_60px_rgba(35,52,46,0.08)]">
      <CardHeader className="gap-3 px-4 pt-5 sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
              새 거래 입력
            </CardTitle>
            <p className="text-sm leading-6 text-stone-500">
              복식부기 규칙과 CoupleLine 입력 원칙을 그대로 반영한 빠른 입력
              폼이에요.
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${activeType.tone}`}
          >
            <TypeIcon className="size-4" />
            {activeType.label} 모드
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {quickGuides.map((guide) => (
            <div
              key={guide.title}
              className="rounded-[1.1rem] border border-white/80 bg-stone-50/85 px-3.5 py-3"
            >
              <p className="text-xs font-semibold text-stone-800">
                {guide.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-500">
                {guide.description}
              </p>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-5 sm:px-6">
        <form
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"
          onSubmit={form.handleSubmit(async (values) => {
            await mutation.mutateAsync({ data: { spaceId, ...values } })
          })}
        >
          <div className="space-y-2 xl:col-span-1">
            <Label>일자</Label>
            <Input
              type="date"
              {...form.register('date')}
              className="h-11 rounded-xl bg-white/80"
            />
          </div>
          <div className="space-y-2 xl:col-span-1">
            <Label>유형</Label>
            <Select
              value={type}
              onValueChange={(value) => {
                form.setValue('type', value as TransactionFormInput['type'], {
                  shouldValidate: true,
                })
                form.setValue('fromAccountId', '')
                form.setValue('fromCategoryId', '')
                form.setValue('toAccountId', '')
                form.setValue('toCategoryId', '')
              }}
            >
              <SelectTrigger className="h-11 rounded-xl bg-white/80">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 xl:col-span-1">
            <Label>금액</Label>
            <Input
              type="number"
              placeholder="환불은 음수 지출"
              className="h-11 rounded-xl bg-white/80"
              {...form.register('amount', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2 xl:col-span-3">
            <Label>메모</Label>
            <Textarea
              rows={2}
              placeholder="예: 친구 모임 1/N 정산"
              className="min-h-11 rounded-xl bg-white/80"
              {...form.register('memo')}
            />
          </div>

          {(type === '지출' || type === '이체') && (
            <FieldSelect
              label={type === '이체' ? '보내는 계좌' : '출금 계좌'}
              value={form.watch('fromAccountId') ?? ''}
              onValueChange={(value) =>
                form.setValue('fromAccountId', value, { shouldValidate: true })
              }
              placeholder="계좌 선택"
              options={accountOptions}
              error={form.formState.errors.fromAccountId?.message}
            />
          )}

          {type === '수입' && (
            <FieldSelect
              label="수입 카테고리"
              value={form.watch('fromCategoryId') ?? ''}
              onValueChange={(value) =>
                form.setValue('fromCategoryId', value, { shouldValidate: true })
              }
              placeholder="카테고리 선택"
              options={incomeCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              error={form.formState.errors.fromCategoryId?.message}
            />
          )}

          {(type === '수입' || type === '이체') && (
            <FieldSelect
              label={type === '이체' ? '받는 계좌' : '입금 계좌'}
              value={form.watch('toAccountId') ?? ''}
              onValueChange={(value) =>
                form.setValue('toAccountId', value, { shouldValidate: true })
              }
              placeholder="계좌 선택"
              options={accountOptions}
              error={form.formState.errors.toAccountId?.message}
            />
          )}

          {type === '지출' && (
            <FieldSelect
              label="지출 카테고리"
              value={form.watch('toCategoryId') ?? ''}
              onValueChange={(value) =>
                form.setValue('toCategoryId', value, { shouldValidate: true })
              }
              placeholder="카테고리 선택"
              options={expenseCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              error={form.formState.errors.toCategoryId?.message}
            />
          )}

          <div className="sm:col-span-2 xl:col-span-2 xl:self-end">
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              disabled={mutation.isPending}
              aria-busy={mutation.isPending}
            >
              {mutation.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : null}
              거래 저장
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function FieldSelect({
  label,
  value,
  onValueChange,
  placeholder,
  options,
  error,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: Array<{ value: string; label: string }>
  error?: string
}) {
  return (
    <div className="space-y-2 sm:col-span-1 xl:col-span-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-11 rounded-xl bg-white/80">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  )
}

function getTransactionFeedback(
  type: '수입' | '지출' | '이체',
  amount: number,
) {
  if (type === '수입') {
    return '선택한 입금 계좌와 수입 카테고리에 반영했어요.'
  }

  if (type === '이체') {
    return '보내는 계좌와 받는 계좌 잔액을 동시에 업데이트했어요.'
  }

  if (amount < 0) {
    return '음수 지출로 기록해 환불/정산 상계 흐름으로 반영했어요.'
  }

  return '선택한 출금 계좌와 지출 카테고리에 반영했어요.'
}
