import { notFound } from "next/navigation";

import { PostListContainer } from "@/features/post-list/PostListContainer";
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
  const posts = await getPostsByCategory(category);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostListContainer
        title={`Category: ${category}`}
        initialPosts={posts}
        postsPerPage={12}
      />
    </div>
  );
};

export default CategoryDetailPage;
