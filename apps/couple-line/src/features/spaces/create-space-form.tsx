import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createSpaceFn } from '#/entities/space/server'
import { getErrorMessage } from '#/shared/lib/error'
import { Button } from '#/shared/ui/button'
import { Input } from '#/shared/ui/input'
import { Label } from '#/shared/ui/label'

const schema = z.object({
  name: z.string().trim().min(2, '공간 이름을 2자 이상 입력해 주세요.').max(40),
})

type FormValues = z.infer<typeof schema>

export function CreateSpaceForm() {
  const router = useRouter()
  const createSpace = useServerFn(createSpaceFn)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '형민 ♥ 희재 가계부' },
  })

  const mutation = useMutation({
    mutationFn: createSpace,
    onSuccess: async (data) => {
      toast.success('새 공간을 만들었어요.', {
        description: `${form.getValues('name')} 공간으로 이동할게요.`,
      })
      await router.invalidate()
      await router.navigate({
        to: '/$spaceId',
        params: { spaceId: data.spaceId },
      })
    },
    onError: (error) => {
      toast.error('공간을 만들지 못했어요.', {
        description: getErrorMessage(error),
      })
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await mutation.mutateAsync({ data: values })
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="space-name">우리 공간 이름</Label>
        <Input
          id="space-name"
          className="h-11 rounded-xl bg-white"
          placeholder="예: CoupleLine House"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-rose-600">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-500 sm:w-auto"
        disabled={mutation.isPending}
        aria-busy={mutation.isPending}
      >
        {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
        첫 공간 만들기
      </Button>
    </form>
  )
}
