import { PostListContainer } from "@/features/post-list/PostListContainer";
import { getAllPostSummaries } from "@/shared/lib/posts";
import { getSeriesRegistry } from "@/shared/lib/series";

export const metadata = {
  title: "Posts",
};

const PostsPage = async () => {
  const [posts, seriesRegistry] = await Promise.all([
    getAllPostSummaries(),
    getSeriesRegistry(),
  ]);

  const publishedPosts = posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());

  const postsWithSeriesColor = publishedPosts.map((post) => ({
    ...post,
    seriesColor: post.meta.series
      ? seriesRegistry[post.meta.series]?.color
      : undefined,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <PostListContainer
        title="Posts"
        initialPosts={postsWithSeriesColor}
        postsPerPage={12}
      />
    </div>
  );
};

export default PostsPage;
