import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_space')({
  beforeLoad: ({ context, location }) => {
    if (!context.viewer) {
      throw redirect({
        to: '/login',
        search: {
          redirect: `${location.pathname}${location.search}`,
        },
      })
    }
  },
  component: Outlet,
})
