import Link from "next/link";

import type { HomePageData } from "../_lib/home-page-data";

import { PostCard } from "@/features/post-list/PostCard";

type LatestPostsSectionProps = {
  posts: HomePageData["latestPosts"];
};

export const LatestPostsSection = ({ posts }: LatestPostsSectionProps) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Latest Posts</h1>
      <Link
        href="/posts"
        className="text-sm text-primary-600 hover:text-secondary-400 transition-colors"
      >
        전체 글 보기 →
      </Link>
    </div>
    {posts.length === 0 ? (
      <p className="text-primary-700">포스트가 없습니다.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            meta={post.meta}
            firstImage={post.firstImage}
            seriesColor={post.seriesColor}
          />
        ))}
      </div>
    )}
  </section>
);
