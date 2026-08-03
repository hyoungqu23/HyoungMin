import { notFound } from "next/navigation";

import { PostListContainer } from "@/features/post-list/PostListContainer";
import { getSeriesRegistry } from "@/shared/lib/series";
import { getAllTags, getPostsByTag } from "@/shared/lib/taxonomies";

export const generateStaticParams = async () => {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag: tag.name }));
};

const TagDetailPage = async ({
  params,
}: {
  params: Promise<{ tag: string }>;
}) => {
  const { tag } = await params;
  const [posts, seriesRegistry] = await Promise.all([
    getPostsByTag(tag),
    getSeriesRegistry(),
  ]);

  if (posts.length === 0) {
    notFound();
  }

  const postsWithSeriesColor = posts.map((post) => ({
    ...post,
    seriesColor: post.meta.series
      ? seriesRegistry[post.meta.series]?.color
      : undefined,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <PostListContainer
        title={`Tag: ${tag}`}
        initialPosts={postsWithSeriesColor}
        postsPerPage={12}
      />
    </div>
  );
};

export default TagDetailPage;
