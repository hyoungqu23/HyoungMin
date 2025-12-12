import { notFound } from "next/navigation";

import { PostListContainer } from "@/features/post-list/PostListContainer";
import { getSeriesRegistry } from "@/shared/lib/series";
import { getAllSeries, getPostsBySeries } from "@/shared/lib/taxonomies";

export const generateStaticParams = async () => {
  const seriesList = await getAllSeries();
  return seriesList.map((series) => ({ series: series.id }));
};

const SeriesDetailPage = async ({
  params,
}: {
  params: Promise<{ series: string }>;
}) => {
  const { series: seriesId } = await params;

  const [registry, posts] = await Promise.all([
    getSeriesRegistry(),
    getPostsBySeries(seriesId),
  ]);

  if (posts.length === 0) {
    notFound();
  }

  const entry = registry[seriesId];
  const title = entry?.title ?? seriesId;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {entry?.description && (
          <p className="text-primary-700">{entry.description}</p>
        )}
      </div>

      <PostListContainer
        title={null}
        showLayoutToggle
        initialPosts={posts}
        postsPerPage={12}
      />
    </div>
  );
};

export default SeriesDetailPage;
