"use client";

import type { PostMeta } from "@hyoungmin/schema";
import { useMemo, useState } from "react";

import { LayoutToggle, type LayoutType } from "./LayoutToggle";
import { PostCard } from "./PostCard";
import { PostList } from "./PostList";
import { useInfiniteScroll } from "./useInfiniteScroll";

export type PostWithSlug = {
  slug: string;
  meta: PostMeta;
  firstImage?: string | null;
};

interface PostListContainerProps {
  initialPosts: PostWithSlug[];
  postsPerPage?: number;
}

export const PostListContainer = ({
  initialPosts,
  postsPerPage = 12,
}: PostListContainerProps) => {
  const [layout, setLayout] = useState<LayoutType>("list");
  const [displayedCount, setDisplayedCount] = useState(postsPerPage);

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
  };

  const displayedPosts = useMemo(
    () => initialPosts.slice(0, displayedCount),
    [initialPosts, displayedCount],
  );

  const hasMore = displayedCount < initialPosts.length;

  const handleLoadMore = () => {
    if (hasMore) {
      setDisplayedCount((prev) => prev + postsPerPage);
    }
  };

  const { observerTarget } = useInfiniteScroll({
    hasMore,
    onLoadMore: handleLoadMore,
  });

  return (
    <div className="space-y-6">
      {/* 헤더 및 레이아웃 토글 */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Blog</h1>
        <LayoutToggle layout={layout} onLayoutChange={handleLayoutChange} />
      </div>

      {/* 포스트 목록 */}
      {layout === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              meta={post.meta}
              firstImage={post.firstImage}
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {displayedPosts.map((post) => (
            <PostList key={post.slug} slug={post.slug} meta={post.meta} />
          ))}
        </ul>
      )}

      {/* 무한 스크롤 트리거 */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center"
        >
          <div className="text-sm text-primary-600">
            더 많은 포스트를 불러오는 중...
          </div>
        </div>
      )}

      {/* 모든 포스트 로드 완료 */}
      {!hasMore && initialPosts.length > 0 && (
        <div className="text-center text-sm text-primary-600 py-8">
          모든 포스트를 불러왔습니다.
        </div>
      )}
    </div>
  );
};
