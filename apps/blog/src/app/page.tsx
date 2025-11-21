import { PostListContainer } from "@/features/post-list/PostListContainer";
import { getAllPostSummaries } from "@/shared/lib/posts";

const Home = async () => {
  const posts = await getAllPostSummaries();

  const publishedPosts = posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <PostListContainer initialPosts={publishedPosts} postsPerPage={12} />
    </div>
  );
};

export default Home;
