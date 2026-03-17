import { redirect, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginPage } from '#/pages/login/ui/login-page'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.viewer) {
      if (search.redirect?.startsWith('/')) {
        throw redirect({ href: search.redirect })
      }

      if (context.viewer.spaces.length > 0) {
        const firstSpace = context.viewer.spaces[0]
        throw redirect({ to: '/$spaceId', params: { spaceId: firstSpace.id } })
      }

      throw redirect({ to: '/' })
    }
  },
  component: LoginRoute,
})

function LoginRoute() {
  const search = Route.useSearch()
  return <LoginPage redirectTo={search.redirect} />
}
