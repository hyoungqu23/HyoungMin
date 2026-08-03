import { notFound } from "next/navigation";

import { PostListContainer } from "@/features/post-list/PostListContainer";
import { getSeriesRegistry } from "@/shared/lib/series";
import { getAllCategories, getPostsByCategory } from "@/shared/lib/taxonomies";

export const generateStaticParams = async () => {
  const categories = await getAllCategories();
  return categories.map((category) => ({ category: category.name }));
};

const CategoryDetailPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;
  const [posts, seriesRegistry] = await Promise.all([
    getPostsByCategory(category),
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
        title={`Category: ${category}`}
        initialPosts={postsWithSeriesColor}
        postsPerPage={12}
      />
    </div>
  );
};

export default CategoryDetailPage;
