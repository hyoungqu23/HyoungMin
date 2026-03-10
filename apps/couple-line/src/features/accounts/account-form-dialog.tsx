import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoaderCircle, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Database } from '#/shared/api/supabase/database.types'
import { deleteAccountFn, upsertAccountFn } from '#/entities/account/server'
import {
  ACCOUNT_OWNERS,
  ACCOUNT_SUB_TYPES,
  ASSET_GROUPS,
} from '#/shared/lib/constants'
import { getErrorMessage } from '#/shared/lib/error'
import { Button } from '#/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/shared/ui/dialog'
import { Input } from '#/shared/ui/input'
import { Label } from '#/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/ui/select'

const accountSchema = z.object({
  name: z.string().trim().min(1, '계정 이름을 입력해 주세요.').max(40),
  type: z.enum(['자산', '부채']),
  subType: z.string().default('입출금'),
  assetGroup: z.string().default('미분류 자산'),
  owner: z.string().default('공용'),
  initialBalance: z.coerce.number(),
})

type AccountFormInput = z.input<typeof accountSchema>
type AccountFormOutput = z.output<typeof accountSchema>
type AccountRow = Database['public']['Tables']['accounts']['Row']

export function AccountFormDialog({
  spaceId,
  initialValue,
}: {
  spaceId: string
  initialValue?: AccountRow
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const upsertAccount = useServerFn(upsertAccountFn)
  const deleteAccount = useServerFn(deleteAccountFn)
  const form = useForm<AccountFormInput, unknown, AccountFormOutput>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: initialValue?.name ?? '',
      type: (initialValue?.type as '자산' | '부채' | undefined) ?? '자산',
      subType: initialValue?.sub_type ?? '입출금',
      assetGroup: initialValue?.asset_group ?? '미분류 자산',
      owner: initialValue?.owner ?? '공용',
      initialBalance: Number(initialValue?.initial_balance ?? 0),
    },
  })

  const accountType = form.watch('type')

  const saveMutation = useMutation({
    mutationFn: upsertAccount,
    onSuccess: async () => {
      setOpen(false)
      toast.success(
        initialValue ? '계정을 수정했어요.' : '계정을 추가했어요.',
        {
          description: '잔액과 포트폴리오 비중이 곧바로 다시 계산됩니다.',
        },
      )
      await router.invalidate()
    },
    onError: (error) => {
      toast.error('계정을 저장하지 못했어요.', {
        description: getErrorMessage(error),
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      setOpen(false)
      toast.success('계정을 삭제했어요.', {
        description: '연결된 거래가 없다면 즉시 목록에서 사라집니다.',
      })
      await router.invalidate()
    },
    onError: (error) => {
      toast.error('계정을 삭제하지 못했어요.', {
        description: getErrorMessage(
          error,
          '연결된 거래가 있는 계정은 먼저 정리해야 해요.',
        ),
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initialValue ? (
          <Button variant="outline" size="sm" className="rounded-full">
            <Pencil className="size-4" /> 편집
          </Button>
        ) : (
          <Button className="w-full rounded-full bg-stone-900 text-white hover:bg-stone-800 sm:w-auto">
            <Plus className="size-4" /> 계정 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initialValue ? '계정 수정' : '계정 추가'}
          </DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={form.handleSubmit(async (values) => {
            await saveMutation.mutateAsync({
              data: {
                ...values,
                id: initialValue?.id,
                spaceId,
              },
            })
          })}
        >
          <div className="space-y-2 sm:col-span-2">
            <Label>계정 이름</Label>
            <Input
              className="h-11 rounded-xl bg-white"
              {...form.register('name')}
            />
          </div>
          <div className="space-y-2">
            <Label>구분</Label>
            <Select
              value={accountType}
              onValueChange={(value) =>
                form.setValue('type', value as '자산' | '부채')
              }
            >
              <SelectTrigger className="h-11 w-full rounded-xl bg-white">
                <SelectValue placeholder="구분 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="자산">자산</SelectItem>
                <SelectItem value="부채">부채</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>서브 타입</Label>
            <Select
              value={form.watch('subType')}
              onValueChange={(value) => form.setValue('subType', value)}
            >
              <SelectTrigger className="h-11 w-full rounded-xl bg-white">
                <SelectValue placeholder="서브 타입" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_SUB_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {accountType === '자산' ? (
            <div className="space-y-2">
              <Label>자산 성격</Label>
              <Select
                value={form.watch('assetGroup')}
                onValueChange={(value) => form.setValue('assetGroup', value)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl bg-white">
                  <SelectValue placeholder="자산 성격 선택" />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_GROUPS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>자산 성격</Label>
              <Input
                className="h-11 rounded-xl bg-white"
                value="부채"
                disabled
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>소유자</Label>
            <Select
              value={form.watch('owner')}
              onValueChange={(value) => form.setValue('owner', value)}
            >
              <SelectTrigger className="h-11 w-full rounded-xl bg-white">
                <SelectValue placeholder="소유자 선택" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_OWNERS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>초기 잔액</Label>
            <Input
              type="number"
              className="h-11 rounded-xl bg-white"
              {...form.register('initialBalance', { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            {initialValue ? (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full text-rose-600 sm:w-auto"
                onClick={async () => {
                  if (
                    window.confirm(
                      '정말 삭제할까요? 연결된 거래가 있으면 실패할 수 있습니다.',
                    )
                  ) {
                    await removeMutation.mutateAsync({
                      data: { spaceId, accountId: initialValue.id },
                    })
                  }
                }}
              >
                삭제
              </Button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <Button
              type="submit"
              className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-500 sm:w-auto"
              disabled={saveMutation.isPending}
              aria-busy={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : null}
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
