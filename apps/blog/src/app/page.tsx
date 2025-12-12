import Link from "next/link";

import { PostCard } from "@/features/post-list/PostCard";
import { GeneratedThumbnail } from "@/features/post-list/GeneratedThumbnail";
import { getAllPostSummaries } from "@/shared/lib/posts";
import { getSeriesRegistry } from "@/shared/lib/series";
import {
  getAllTags,
  getAllSeriesWithPostsPreview,
  getTopCategoriesByLatestPost,
} from "@/shared/lib/taxonomies";

const Home = async () => {
  const [posts, seriesList, topCategories, tags, seriesRegistry] =
    await Promise.all([
      getAllPostSummaries(),
      getAllSeriesWithPostsPreview(3),
      getTopCategoriesByLatestPost(10),
      getAllTags(),
      getSeriesRegistry(),
    ]);

  const topSeries = [...seriesList]
    .sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime())
    .slice(0, 3);

  const publishedPosts = posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());

  const latestPosts = publishedPosts.slice(0, 9).map((post) => ({
    ...post,
    seriesColor: post.meta.series
      ? seriesRegistry[post.meta.series]?.color
      : undefined,
  }));

  const tagsByCount = [...tags].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name, "ko");
  });
  const topTags = tagsByCount.slice(0, 20);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* 최신 글 */}
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
        {latestPosts.length === 0 ? (
          <p className="text-primary-700">포스트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
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

      {/* 시리즈 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Series</h2>
          <Link
            href="/series"
            className="text-sm text-primary-600 hover:text-secondary-400 transition-colors"
          >
            모든 시리즈 →
          </Link>
        </div>
        {topSeries.length === 0 ? (
          <p className="text-primary-700">시리즈가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topSeries.map((series) => (
              <Link
                key={series.id}
                href={`/series/${encodeURIComponent(series.id)}`}
                className="group block rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors overflow-hidden"
              >
                <div className="relative w-full h-36 bg-primary-100">
                  <GeneratedThumbnail
                    title={series.title}
                    className="w-full h-full"
                    bgColor={seriesRegistry[series.id]?.color}
                  />
                  {series.previewPosts.length > 0 && (
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary-900/90 via-primary-900/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm p-3">
                      <ul className="space-y-1">
                        {series.previewPosts.map((post) => (
                          <li
                            key={post.slug}
                            className="flex items-baseline justify-between gap-2"
                          >
                            <span className="text-xs font-medium line-clamp-1">
                              {post.meta.title}
                            </span>
                            <time
                              className="text-[0.65rem] opacity-80 whitespace-nowrap"
                              dateTime={post.meta.createdAt.toISOString()}
                            >
                              {post.meta.createdAt.toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </time>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-white/10">
                          시리즈 바로가기 →
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{series.title}</h3>
                    <span className="text-sm text-primary-600">
                      {series.count}개
                    </span>
                  </div>
                  {series.description && (
                    <p className="text-sm text-primary-700 mt-2 line-clamp-2">
                      {series.description}
                    </p>
                  )}
                  <p className="text-xs text-primary-500 mt-2">
                    최신 글:{" "}
                    {series.latestAt.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 카테고리 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link
            href="/categories"
            className="text-sm text-primary-600 hover:text-secondary-400 transition-colors"
          >
            모든 카테고리 →
          </Link>
        </div>
        {topCategories.length === 0 ? (
          <p className="text-primary-700">카테고리가 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topCategories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="px-3 py-1 text-sm border rounded hover:bg-primary-50 transition-colors"
              >
                {category.name}{" "}
                <span className="text-primary-500">({category.count})</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 태그 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tags</h2>
          <Link
            href="/tags"
            className="text-sm text-primary-600 hover:text-secondary-400 transition-colors"
          >
            모든 태그 →
          </Link>
        </div>
        {topTags.length === 0 ? (
          <p className="text-primary-700">태그가 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="px-3 py-1 text-sm border rounded hover:bg-primary-50 transition-colors"
              >
                {tag.name}{" "}
                <span className="text-primary-500">({tag.count})</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
