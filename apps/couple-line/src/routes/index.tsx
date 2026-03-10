import { redirect, createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/pages/home/ui/home-page'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.viewer) {
      throw redirect({ to: '/login' })
    }

    if (context.viewer.spaces.length === 1) {
      throw redirect({
        to: '/$spaceId',
        params: { spaceId: context.viewer.spaces[0].id },
      })
    }
  },
  component: HomeRoute,
})

function HomeRoute() {
  const { viewer } = Route.useRouteContext()
  return <HomePage viewer={viewer!} />
}
