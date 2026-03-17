import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Copy, Link2, LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createInviteLinkFn } from '#/entities/space/server'
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

const EXPIRE_OPTIONS = [
  { label: '24시간', value: 24 },
  { label: '3일', value: 72 },
  { label: '7일', value: 168 },
  { label: '30일', value: 720 },
] as const

const schema = z.object({
  password: z
    .string()
    .trim()
    .min(4, '4자 이상 비밀번호를 입력해 주세요.')
    .max(32),
  expireHours: z.number(),
})

export function InviteMemberDialog({ spaceId }: { spaceId: string }) {
  const [open, setOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string>('')
  const createInviteLink = useServerFn(createInviteLinkFn)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', expireHours: 72 },
  })

  const mutation = useMutation({
    mutationFn: createInviteLink,
    onSuccess: async (result) => {
      const link = `${window.location.origin}/${spaceId}/invite?password=${encodeURIComponent(result.inviteHash)}`

      try {
        await navigator.clipboard.writeText(link)
        setCopiedLink(link)
        toast.success('초대 링크를 복사했어요.', {
          description: '상대방에게 보내면 바로 공간에 합류할 수 있어요.',
        })
      } catch (error) {
        setCopiedLink(link)
        toast.error('링크는 만들었지만 자동 복사에 실패했어요.', {
          description: getErrorMessage(
            error,
            '아래 링크를 직접 복사해서 전달해 주세요.',
          ),
        })
      }
    },
    onError: (error) => {
      toast.error('초대 링크를 만들지 못했어요.', {
        description: getErrorMessage(error),
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-full bg-stone-900 text-white hover:bg-stone-800 sm:w-auto">
          <Link2 className="size-4" /> 초대 링크 만들기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            초대 링크 생성
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await mutation.mutateAsync({
              data: {
                spaceId,
                password: values.password,
                expireHours: values.expireHours,
              },
            })
          })}
        >
          <div className="space-y-2">
            <Label>초대 비밀번호</Label>
            <Input
              type="password"
              className="h-11 rounded-xl bg-white"
              placeholder="상대방이 직접 입력할 비밀번호"
              {...form.register('password')}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-rose-600">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>링크 유효 기간</Label>
            <select
              className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm"
              {...form.register('expireHours', { valueAsNumber: true })}
            >
              {EXPIRE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
          >
            {mutation.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : null}
            링크 만들고 복사하기
          </Button>
        </form>
        {copiedLink ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-800">
              클립보드에 복사했어요.
            </p>
            <p className="mt-2 break-all text-sm text-stone-600">
              {copiedLink}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full rounded-full sm:w-auto"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(copiedLink)
                  toast.success('초대 링크를 다시 복사했어요.')
                } catch (error) {
                  toast.error('클립보드 복사에 실패했어요.', {
                    description: getErrorMessage(
                      error,
                      '브라우저 권한을 확인한 뒤 다시 시도해 주세요.',
                    ),
                  })
                }
              }}
            >
              <Copy className="size-4" /> 다시 복사
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
