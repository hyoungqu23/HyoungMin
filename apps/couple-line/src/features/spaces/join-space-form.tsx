import { useMutation } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { joinSpaceWithInviteFn } from '#/entities/space/server'
import { getErrorMessage } from '#/shared/lib/error'
import { Button } from '#/shared/ui/button'
import { Input } from '#/shared/ui/input'
import { Label } from '#/shared/ui/label'

const schema = z.object({
  password: z.string().trim().min(4, '초대 비밀번호를 입력해 주세요.'),
})

export function JoinSpaceForm({ spaceId }: { spaceId: string }) {
  const router = useRouter()
  const navigate = useNavigate()
  const joinSpace = useServerFn(joinSpaceWithInviteFn)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '' },
  })

  const mutation = useMutation({
    mutationFn: joinSpace,
    onSuccess: async (result) => {
      if (result.joined || result.alreadyMember) {
        toast.success(
          result.alreadyMember
            ? '이미 참여 중인 공간이에요.'
            : '공간에 합류했어요.',
          {
            description: '이제 대시보드로 이동합니다.',
          },
        )
        await router.invalidate()
        await navigate({ to: '/$spaceId', params: { spaceId } })
      } else {
        toast.error('비밀번호가 일치하지 않아요.', {
          description:
            '초대 링크를 만든 사람이 정한 비밀번호를 다시 확인해 주세요.',
        })
        form.setError('password', {
          message: '비밀번호가 일치하지 않습니다.',
        })
      }
    },
    onError: (error) => {
      toast.error('공간에 합류하지 못했어요.', {
        description: getErrorMessage(error),
      })
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await mutation.mutateAsync({
          data: { spaceId, password: values.password },
        })
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="invite-password">초대 비밀번호</Label>
        <Input
          id="invite-password"
          type="password"
          className="h-11 rounded-xl bg-white"
          placeholder="초대 링크를 만든 사람이 정한 비밀번호"
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-rose-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        className="h-11 w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-500 sm:w-auto"
        disabled={mutation.isPending}
        aria-busy={mutation.isPending}
      >
        {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
        공간 참여하기
      </Button>
    </form>
  )
}
