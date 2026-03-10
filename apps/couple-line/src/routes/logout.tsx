import { createFileRoute } from '@tanstack/react-router'
import { logoutFn } from '#/entities/viewer/server'

export const Route = createFileRoute('/logout')({
  loader: async () => {
    await logoutFn()
    return null
  },
  component: () => null,
})
