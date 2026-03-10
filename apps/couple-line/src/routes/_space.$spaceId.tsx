import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'
import { SpaceShell } from '#/widgets/app-shell/space-shell'
import { SpaceProvider } from '#/widgets/app-shell/space-context'
import { fetchSpaceAccessFn } from '#/entities/space/server'

export const Route = createFileRoute('/_space/$spaceId')({
  beforeLoad: async ({ params }) => {
    const access = await fetchSpaceAccessFn({
      data: { spaceId: params.spaceId },
    })

    if (!access) {
      throw redirect({
        to: '/login',
        search: { redirect: `/${params.spaceId}` },
      })
    }

    return access
  },
  component: SpaceLayout,
})

function SpaceLayout() {
  const { space, membership } = Route.useRouteContext()

  return (
    <SpaceProvider value={{ space, membership }}>
      <SpaceShell>
        <Outlet />
      </SpaceShell>
    </SpaceProvider>
  )
}
