import { notFound } from "next/navigation";

import { PostListContainer } from "@/features/post-list/PostListContainer";
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
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostListContainer
        title={`Tag: ${tag}`}
        initialPosts={posts}
        postsPerPage={12}
      />
    </div>
  );
};

export default TagDetailPage;
