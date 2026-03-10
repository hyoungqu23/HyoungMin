import { createFileRoute } from '@tanstack/react-router'
import { fetchDashboardDataFn } from '#/entities/space/server'
import { SpaceDashboardPage } from '#/pages/dashboard/ui/space-dashboard-page'
import { DashboardPageSkeleton } from '#/shared/ui/page-skeleton'

export const Route = createFileRoute('/_space/$spaceId/')({
  loader: ({ params }) =>
    fetchDashboardDataFn({ data: { spaceId: params.spaceId } }),
  pendingMs: 120,
  pendingMinMs: 250,
  pendingComponent: DashboardRoutePending,
  component: DashboardRoute,
})

function DashboardRoute() {
  return <SpaceDashboardPage data={Route.useLoaderData()} />
}

function DashboardRoutePending() {
  return <DashboardPageSkeleton />
}
