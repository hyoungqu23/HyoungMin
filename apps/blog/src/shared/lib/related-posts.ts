import { listSlugs, readArticle } from './fs';
import { compilePostMDX } from './mdx';
import type { PostMeta } from '@hyoungmin/schema';

export type PostWithSlug = {
  slug: string;
  meta: PostMeta;
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

    // 모든 포스트 메타데이터 가져오기
    const allPosts = await Promise.all(
      slugs.map(async (slug): Promise<PostWithSlug | null> => {
        try {
          const source = await readArticle(slug);
          const { meta } = await compilePostMDX(source, {});

          // 드래프트 제외
          if (meta.draft) {
            return null;
          }

          return {
            slug,
            meta,
          };
        } catch {
          return null;
        }
      }),
    );

    const validPosts: PostWithSlug[] = allPosts.filter(
      (post): post is PostWithSlug => post !== null,
    );

    // 현재 포스트 찾기
    const currentPost = validPosts.find((post) => post.slug === currentSlug);

    if (!currentPost) {
      return [];
    }

    // 현재 포스트 제외
    const otherPosts = validPosts.filter((post) => post.slug !== currentSlug);

    // 태그 기반 유사도 계산
    const postsWithSimilarity = otherPosts.map((post) => {
      const currentTags = new Set(currentPost.meta.tags);
      const postTags = new Set(post.meta.tags);

      // 공통 태그 수 계산
      let commonTagsCount = 0;
      for (const tag of currentTags) {
        if (postTags.has(tag)) {
          commonTagsCount++;
        }
      }

      return {
        post,
        similarity: commonTagsCount,
        date: post.meta.date,
      };
    });

    // 유사도 높은 순 정렬, 동일 시 최신순
    const sortedPosts = postsWithSimilarity.sort((a, b) => {
      if (b.similarity !== a.similarity) {
        return b.similarity - a.similarity;
      }
      return b.date.getTime() - a.date.getTime();
    });

    // 유사도가 0인 포스트는 제외하고 limit만큼 반환
    const relatedPosts = sortedPosts
      .filter((item) => item.similarity > 0)
      .slice(0, limit)
      .map((item) => item.post);

    return relatedPosts;
  } catch (error) {
    console.error('Error getting related posts:', error);
    return [];
  }
};

