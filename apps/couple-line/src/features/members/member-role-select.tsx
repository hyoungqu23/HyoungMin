import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { updateMemberRoleFn } from '#/entities/member/server'
import type { Enums } from '#/shared/api/supabase/database.types'
import { ROLE_LABEL } from '#/shared/lib/constants'
import { getErrorMessage } from '#/shared/lib/error'
import { Badge } from '#/shared/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/ui/select'

type UserRole = Enums<'user_role'>

export function MemberRoleSelect({
  spaceId,
  memberUserId,
  currentUserId,
  currentRole,
  canEdit,
}: {
  spaceId: string
  memberUserId: string
  currentUserId: string
  currentRole: UserRole
  canEdit: boolean
}) {
  const router = useRouter()
  const updateRole = useServerFn(updateMemberRoleFn)
  const mutation = useMutation({
    mutationFn: updateRole,
    onSuccess: async () => {
      await router.invalidate()
    },
    onError: (error) => {
      toast.error('역할을 변경하지 못했어요.', {
        description: getErrorMessage(error),
      })
    },
  })

  if (!canEdit || memberUserId === currentUserId) {
    return (
      <Badge className="rounded-full bg-stone-100 text-stone-700">
        {ROLE_LABEL[currentRole]}
      </Badge>
    )
  }

  return (
    <Select
      disabled={mutation.isPending}
      value={currentRole}
      onValueChange={async (value) => {
        await mutation.mutateAsync({
          data: {
            spaceId,
            userId: memberUserId,
            role: value as UserRole,
          },
        })
        toast.success('역할을 변경했어요.', {
          description: `${ROLE_LABEL[value as UserRole]} 권한으로 업데이트했어요.`,
        })
      }}
    >
      <SelectTrigger className="w-full rounded-full sm:w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="OWNER">오너</SelectItem>
        <SelectItem value="MANAGER">매니저</SelectItem>
        <SelectItem value="MEMBER">멤버</SelectItem>
      </SelectContent>
    </Select>
  )
}
