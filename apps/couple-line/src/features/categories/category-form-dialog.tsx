import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoaderCircle, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { deleteCategoryFn, upsertCategoryFn } from '#/entities/category/server'
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

const schema = z.object({
  name: z.string().trim().min(1, '카테고리 이름을 입력해 주세요.').max(30),
  type: z.enum(['수입', '지출']),
})

export function CategoryFormDialog({
  spaceId,
  initialValue,
}: {
  spaceId: string
  initialValue?: { id: string; name: string; type: '수입' | '지출' }
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const upsertCategory = useServerFn(upsertCategoryFn)
  const deleteCategory = useServerFn(deleteCategoryFn)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValue?.name ?? '',
      type: initialValue?.type ?? '지출',
    },
  })

  const saveMutation = useMutation({
    mutationFn: upsertCategory,
    onSuccess: async () => {
      setOpen(false)
      toast.success(
        initialValue ? '카테고리를 수정했어요.' : '카테고리를 추가했어요.',
        {
          description: '이제 거래 입력 목록에서 바로 선택할 수 있어요.',
        },
      )
      await router.invalidate()
    },
    onError: (error) => {
      toast.error('카테고리를 저장하지 못했어요.', {
        description: getErrorMessage(error),
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      setOpen(false)
      toast.success('카테고리를 삭제했어요.', {
        description: '연결된 거래가 없다면 즉시 목록에서 사라져요.',
      })
      await router.invalidate()
    },
    onError: (error) => {
      toast.error('카테고리를 삭제하지 못했어요.', {
        description: getErrorMessage(
          error,
          '연결된 거래가 있는지 확인한 뒤 다시 시도해 주세요.',
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
            <Plus className="size-4" /> 카테고리 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initialValue ? '카테고리 수정' : '카테고리 추가'}
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await saveMutation.mutateAsync({
              data: { ...values, id: initialValue?.id, spaceId },
            })
          })}
        >
          <div className="space-y-2">
            <Label>이름</Label>
            <Input
              className="h-11 rounded-xl bg-white"
              {...form.register('name')}
            />
            {form.formState.errors.name ? (
              <p className="text-sm text-rose-600">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>유형</Label>
            <Select
              value={form.watch('type')}
              onValueChange={(value) =>
                form.setValue('type', value as '수입' | '지출')
              }
            >
              <SelectTrigger className="h-11 w-full rounded-xl bg-white">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="수입">수입</SelectItem>
                <SelectItem value="지출">지출</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                      data: { spaceId, categoryId: initialValue.id },
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
