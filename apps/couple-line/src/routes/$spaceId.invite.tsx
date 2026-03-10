import { redirect, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SpaceInvitePage } from '#/pages/invite/ui/space-invite-page'
import {
  fetchInviteInfoFn,
  joinSpaceWithInviteFn,
} from '#/entities/space/server'

export const Route = createFileRoute('/$spaceId/invite')({
  validateSearch: z.object({
    password: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({ password: search.password }),
  loader: async ({ params, deps, context }) => {
    const inviteInfo = await fetchInviteInfoFn({
      data: {
        spaceId: params.spaceId,
        passwordHash: deps.password,
      },
    })

    if (context.viewer && deps.password && inviteInfo.isDirectLinkValid) {
      const joinResult = await joinSpaceWithInviteFn({
        data: { spaceId: params.spaceId, passwordHash: deps.password },
      })

      if (joinResult.joined || joinResult.alreadyMember) {
        throw redirect({ to: '/$spaceId', params })
      }
    }

    return inviteInfo
  },
  component: InviteRoute,
})

function InviteRoute() {
  const { viewer } = Route.useRouteContext()
  const { password } = Route.useSearch()
  const data = Route.useLoaderData()
  const params = Route.useParams()
  const redirectTo = password
    ? `/${params.spaceId}/invite?password=${encodeURIComponent(password)}`
    : `/${params.spaceId}/invite`

  return (
    <SpaceInvitePage
      viewer={viewer}
      redirectTo={redirectTo}
      spaceName={data.spaceName}
      hasDirectLink={data.isDirectLinkValid}
      spaceId={params.spaceId}
    />
  )
}
