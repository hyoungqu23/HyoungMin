import { createFileRoute } from '@tanstack/react-router'
import { fetchCategoriesPageDataFn } from '#/entities/category/server'
import { SpaceCategoriesPage } from '#/pages/categories/ui/space-categories-page'
import { CollectionPageSkeleton } from '#/shared/ui/page-skeleton'

export const Route = createFileRoute('/_space/$spaceId/categories')({
  loader: ({ params }) =>
    fetchCategoriesPageDataFn({ data: { spaceId: params.spaceId } }),
  pendingMs: 120,
  pendingMinMs: 250,
  pendingComponent: CategoriesRoutePending,
  component: CategoriesRoute,
})

function CategoriesRoute() {
  const params = Route.useParams()
  const data = Route.useLoaderData()

  return (
    <SpaceCategoriesPage
      spaceId={params.spaceId}
      categories={data.categories}
    />
  )
}

function CategoriesRoutePending() {
  return <CollectionPageSkeleton />
}
