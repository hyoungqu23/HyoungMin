import { createFileRoute } from '@tanstack/react-router'
import { fetchMembersPageDataFn } from '#/entities/member/server'
import { SpaceMembersPage } from '#/pages/members/ui/space-members-page'
import { useViewer } from '#/app/providers/viewer-provider'
import { CollectionPageSkeleton } from '#/shared/ui/page-skeleton'
import { useSpace } from '#/widgets/app-shell/space-context'

export const Route = createFileRoute('/_space/$spaceId/members')({
  loader: ({ params }) =>
    fetchMembersPageDataFn({ data: { spaceId: params.spaceId } }),
  pendingMs: 120,
  pendingMinMs: 250,
  pendingComponent: MembersRoutePending,
  component: MembersRoute,
})

function MembersRoute() {
  const params = Route.useParams()
  const data = Route.useLoaderData()
  const viewer = useViewer()
  const { membership } = useSpace()

  if (!viewer) {
    return null
  }

  return (
    <SpaceMembersPage
      spaceId={params.spaceId}
      members={data.members}
      viewer={viewer}
      viewerRole={membership.role}
    />
  )
}

function MembersRoutePending() {
  return <CollectionPageSkeleton />
}
