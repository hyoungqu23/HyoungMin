import { PostListContainer } from "@/features/post-list/PostListContainer";
import { listSlugs, readArticle } from "@/shared/lib/fs";
import { compilePostMDX } from "@/shared/lib/mdx";

const Home = async () => {
  const slugs = await listSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readArticle(slug);
      const { meta, firstImage } = await compilePostMDX(source, {});
      return { slug, meta, firstImage };
    }),
  );

  const publishedPosts = posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());

  return (
    <main className="container mx-auto px-4 py-8">
      <PostListContainer initialPosts={publishedPosts} postsPerPage={12} />
    </main>
  );
};

export default Home;
