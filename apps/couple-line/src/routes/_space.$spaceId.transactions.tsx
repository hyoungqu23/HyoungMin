import { createFileRoute } from '@tanstack/react-router'
import { fetchTransactionsPageDataFn } from '#/entities/transaction/server'
import { SpaceTransactionsPage } from '#/pages/transactions/ui/space-transactions-page'
import { TransactionsPageSkeleton } from '#/shared/ui/page-skeleton'

export const Route = createFileRoute('/_space/$spaceId/transactions')({
  loader: ({ params }) =>
    fetchTransactionsPageDataFn({ data: { spaceId: params.spaceId } }),
  pendingMs: 120,
  pendingMinMs: 250,
  pendingComponent: TransactionsRoutePending,
  component: TransactionsRoute,
})

function TransactionsRoute() {
  const params = Route.useParams()
  const data = Route.useLoaderData()

  return (
    <SpaceTransactionsPage
      spaceId={params.spaceId}
      rows={data.rows}
      accounts={data.accounts}
      categories={data.categories}
    />
  )
}

function TransactionsRoutePending() {
  return <TransactionsPageSkeleton />
}
