import type { PostMeta } from "@hyoungmin/schema";

import { listSlugs } from "./fs";
import { getPostSummary } from "./posts";

export type PostWithSlug = {
  slug: string;
  meta: PostMeta;
};

const countCommonTags = (left: string[], right: string[]): number => {
  const rightTags = new Set(right);
  let count = 0;

  for (const tag of new Set(left)) {
    if (rightTags.has(tag)) count += 1;
  }

  return count;
};

export const rankRelatedPosts = (
  posts: PostWithSlug[],
  currentSlug: string,
  limit: number = 5,
): PostWithSlug[] => {
  const publishedPosts = posts.filter((post) => !post.meta.draft);
  const currentPost = publishedPosts.find((post) => post.slug === currentSlug);

  if (!currentPost) return [];

  return publishedPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      similarity: countCommonTags(currentPost.meta.tags, post.meta.tags),
    }))
    .filter(({ similarity }) => similarity > 0)
    .sort((a, b) => {
      if (b.similarity !== a.similarity) {
        return b.similarity - a.similarity;
      }
      return b.post.meta.createdAt.getTime() - a.post.meta.createdAt.getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
};

/**
 * 태그 기반으로 관련 포스트를 추천합니다.
 * @param currentSlug 현재 포스트의 slug
 * @param limit 추천할 포스트 개수 (기본값: 5)
 * @returns 관련 포스트 배열 (유사도 높은 순, 동일 시 최신순)
 */
export const getRelatedPosts = async (
  currentSlug: string,
  limit: number = 5,
): Promise<PostWithSlug[]> => {
  try {
    const slugs = await listSlugs();

    const allPosts = await Promise.all(
      slugs.map(async (slug): Promise<PostWithSlug | null> => {
        try {
          const { meta } = await getPostSummary(slug);
          return {
            slug,
            meta,
          };
        } catch {
          return null;
        }
      }),
    );

    const validPosts = allPosts.filter(
      (post): post is PostWithSlug => post !== null,
    );
    return rankRelatedPosts(validPosts, currentSlug, limit);
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
};
