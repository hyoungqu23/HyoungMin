import Link from "next/link";

import type { HomePageData } from "../_lib/home-page-data";

import { GeneratedThumbnail } from "@/features/post-list/GeneratedThumbnail";

type FeaturedSeriesSectionProps = {
  series: HomePageData["topSeries"];
  seriesRegistry: HomePageData["seriesRegistry"];
};

export const FeaturedSeriesSection = ({
  series,
  seriesRegistry,
}: FeaturedSeriesSectionProps) => (
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
    {series.length === 0 ? (
      <p className="text-primary-700">시리즈가 없습니다.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {series.map((item) => (
          <Link
            key={item.id}
            href={`/series/${encodeURIComponent(item.id)}`}
            className="group block rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors overflow-hidden"
          >
            <div className="relative w-full h-36 bg-primary-100">
              <GeneratedThumbnail
                title={item.title}
                className="w-full h-full"
                bgColor={seriesRegistry[item.id]?.color}
              />
              {item.previewPosts.length > 0 && (
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary-900/90 via-primary-900/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm p-3">
                  <ul className="space-y-1">
                    {item.previewPosts.map((post) => (
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
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span className="text-sm text-primary-600">{item.count}개</span>
              </div>
              {item.description && (
                <p className="text-sm text-primary-700 mt-2 line-clamp-2">
                  {item.description}
                </p>
              )}
              <p className="text-xs text-primary-500 mt-2">
                최신 글:{" "}
                {item.latestAt.toLocaleDateString("ko-KR", {
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
);
