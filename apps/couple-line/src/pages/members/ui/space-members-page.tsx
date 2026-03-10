import type { ColumnDef } from '@tanstack/react-table'
import type { Viewer } from '#/app/providers/viewer-provider'
import { InviteMemberDialog } from '#/features/members/invite-member-dialog'
import { MemberRoleSelect } from '#/features/members/member-role-select'
import { Avatar, AvatarFallback, AvatarImage } from '#/shared/ui/avatar'
import { Badge } from '#/shared/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/ui/card'
import { DataTable } from '#/shared/ui/data-table'
import { PageShell } from '#/shared/ui/page-shell'
import { SummaryTile } from '#/shared/ui/summary-tile'

type MemberRow = {
  space_id: string
  user_id: string
  role: 'OWNER' | 'MANAGER' | 'MEMBER'
  joined_at: string
  profile: {
    id: string
    email: string
    name: string
    avatar_url: string | null
  } | null
}

export function SpaceMembersPage({
  spaceId,
  members,
  viewer,
  viewerRole,
}: {
  spaceId: string
  members: MemberRow[]
  viewer: Viewer
  viewerRole: 'OWNER' | 'MANAGER' | 'MEMBER'
}) {
  const canManageRole = viewerRole === 'OWNER'
  const ownerCount = members.filter((member) => member.role === 'OWNER').length
  const managerCount = members.filter(
    (member) => member.role === 'MANAGER',
  ).length
  const columns: ColumnDef<MemberRow>[] = [
    {
      id: 'member',
      header: '참여자',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-white/70">
            <AvatarImage
              src={row.original.profile?.avatar_url ?? undefined}
              alt={row.original.profile?.name ?? ''}
            />
            <AvatarFallback>
              {row.original.profile?.name.slice(0, 1) ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-stone-900">
              {row.original.profile?.name ?? '알 수 없는 사용자'}
            </p>
            <p className="text-xs text-stone-500">
              {row.original.profile?.email ?? ''}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: '역할',
      cell: ({ row }) => (
        <MemberRoleSelect
          spaceId={spaceId}
          memberUserId={row.original.user_id}
          currentUserId={viewer.id}
          currentRole={row.original.role}
          canEdit={canManageRole}
        />
      ),
    },
    {
      accessorKey: 'joined_at',
      header: '합류 상태',
      cell: ({ row }) =>
        row.original.user_id === viewer.id ? (
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            나
          </Badge>
        ) : (
          <span className="text-sm text-stone-500">참여 중</span>
        ),
    },
  ]

  return (
    <PageShell
      title="사용자 관리"
      description="참여자 목록을 확인하고, OWNER 권한으로 역할을 조정하거나 초대 링크를 만들 수 있습니다."
      actions={<InviteMemberDialog spaceId={spaceId} />}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryTile
          label="전체 참여자"
          value={`${members.length}명`}
          description="이 공간에 접근 가능한 전체 멤버 수"
        />
        <SummaryTile
          label="OWNER"
          value={`${ownerCount}명`}
          description="공간 설정과 역할을 최종적으로 관리하는 사용자"
          tone="success"
        />
        <SummaryTile
          label="관리 권한자"
          value={`${ownerCount + managerCount}명`}
          description={
            canManageRole
              ? '현재 계정은 역할을 직접 변경할 수 있어요.'
              : '역할 변경은 OWNER만 할 수 있어요.'
          }
          tone="sky"
        />
      </div>
      <Card className="border-white/70 bg-white/88 shadow-[0_18px_60px_rgba(35,52,46,0.08)]">
        <CardHeader className="px-4 pb-0 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
            참여자 목록
          </CardTitle>
          <CardDescription>
            각 참여자의 역할과 소속 상태를 확인하고, OWNER라면 바로 권한을
            조정할 수 있어요.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <DataTable
            columns={columns}
            data={members}
            emptyMessage="아직 참여자가 없습니다."
            mobileCardRenderer={(row) => (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 border border-white/70">
                    <AvatarImage
                      src={row.profile?.avatar_url ?? undefined}
                      alt={row.profile?.name ?? ''}
                    />
                    <AvatarFallback>
                      {row.profile?.name.slice(0, 1) ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-stone-900">
                      {row.profile?.name ?? '알 수 없는 사용자'}
                    </p>
                    <p className="truncate text-sm text-stone-500">
                      {row.profile?.email ?? ''}
                    </p>
                  </div>
                  {row.user_id === viewer.id ? (
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      나
                    </Badge>
                  ) : null}
                </div>
                <div className="flex flex-col gap-3 rounded-2xl bg-white/80 px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-stone-500">역할</span>
                    <MemberRoleSelect
                      spaceId={spaceId}
                      memberUserId={row.user_id}
                      currentUserId={viewer.id}
                      currentRole={row.role}
                      canEdit={canManageRole}
                    />
                  </div>
                </div>
              </div>
            )}
            tableClassName="min-w-[620px]"
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
