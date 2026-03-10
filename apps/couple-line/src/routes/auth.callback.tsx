import { redirect, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { exchangeOAuthCodeFn } from '#/entities/viewer/server'

export const Route = createFileRoute('/auth/callback')({
  validateSearch: z.object({
    code: z.string().optional(),
    next: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({ code: search.code, next: search.next }),
  loader: async ({ deps }) => {
    if (!deps.code) {
      throw redirect({ to: '/login' })
    }

    const result = await exchangeOAuthCodeFn({
      data: { code: deps.code, next: deps.next },
    })

    throw redirect({ href: result.next })
  },
  component: () => null,
})
