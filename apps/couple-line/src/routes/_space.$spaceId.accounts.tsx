import { createFileRoute } from '@tanstack/react-router'
import { fetchAccountsPageDataFn } from '#/entities/account/server'
import { SpaceAccountsPage } from '#/pages/accounts/ui/space-accounts-page'
import { CollectionPageSkeleton } from '#/shared/ui/page-skeleton'

export const Route = createFileRoute('/_space/$spaceId/accounts')({
  loader: ({ params }) =>
    fetchAccountsPageDataFn({ data: { spaceId: params.spaceId } }),
  pendingMs: 120,
  pendingMinMs: 250,
  pendingComponent: AccountsRoutePending,
  component: AccountsRoute,
})

function AccountsRoute() {
  const params = Route.useParams()
  const data = Route.useLoaderData()

  return (
    <SpaceAccountsPage
      spaceId={params.spaceId}
      rows={data.rows}
      accounts={data.accounts}
    />
  )
}

function AccountsRoutePending() {
  return <CollectionPageSkeleton />
}
