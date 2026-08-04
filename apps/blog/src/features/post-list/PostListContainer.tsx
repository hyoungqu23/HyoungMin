"use client";

import type { PostMeta } from "@hyoungmin/schema";
import { useMemo, useState } from "react";

import { LayoutToggle, type LayoutType } from "./LayoutToggle";
import { PostCard } from "./PostCard";
import { PostList } from "./PostList";
import { useInfiniteScroll } from "./useInfiniteScroll";

type PostWithSlug = {
  slug: string;
  meta: PostMeta;
  firstImage?: string | null;
  seriesColor?: string;
};

interface PostListContainerProps {
  initialPosts: PostWithSlug[];
  postsPerPage?: number;
  title?: string | null;
  showLayoutToggle?: boolean;
}

export const PostListContainer = ({
  initialPosts,
  postsPerPage = 12,
  title = "Blog",
  showLayoutToggle = true,
}: PostListContainerProps) => {
  const [layout, setLayout] = useState<LayoutType>("card");
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
    <div className="w-full">
      <header className="flex flex-col gap-8 border-t-2 border-zinc-950 py-10 dark:border-stone-50 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-zinc-500 uppercase dark:text-zinc-400">
            Editorial Index
          </p>
          {title && (
            <h1 className="mt-3 text-5xl font-black tracking-[-0.06em] text-zinc-950 dark:text-stone-50 sm:text-6xl">
              {title}
            </h1>
          )}
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            {initialPosts.length}개의 기록
          </p>
        </div>
        {showLayoutToggle && (
          <LayoutToggle layout={layout} onLayoutChange={handleLayoutChange} />
        )}
      </header>

      {layout === "card" ? (
        <div className="grid grid-cols-1 gap-6 border-t border-zinc-300 pt-6 md:grid-cols-2 xl:grid-cols-3 dark:border-zinc-700">
          {displayedPosts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              meta={post.meta}
              firstImage={post.firstImage}
              seriesColor={post.seriesColor}
            />
          ))}
        </div>
      ) : (
        <ul>
          {displayedPosts.map((post) => (
            <PostList
              key={post.slug}
              slug={post.slug}
              meta={post.meta}
              firstImage={post.firstImage}
              seriesColor={post.seriesColor}
            />
          ))}
        </ul>
      )}

      {/* 무한 스크롤 트리거 */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="flex h-20 items-center justify-center"
        >
          <div className="text-xs font-bold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            더 많은 포스트를 불러오는 중...
          </div>
        </div>
      )}

      {/* 모든 포스트 로드 완료 */}
      {!hasMore && initialPosts.length > 0 && (
        <div className="border-t border-zinc-300 py-8 text-center text-xs font-bold tracking-[0.16em] text-zinc-500 uppercase dark:border-zinc-700 dark:text-zinc-400">
          모든 포스트를 불러왔습니다.
        </div>
      )}
    </div>
  );
};
