import Link from "next/link";

import { GeneratedThumbnail } from "@/features/post-list/GeneratedThumbnail";
import { getSeriesRegistry } from "@/shared/lib/series";
import { getAllSeriesWithPostsPreview } from "@/shared/lib/taxonomies";

export const metadata = {
  title: "Series",
};

const SeriesPage = async () => {
  const [seriesList, registry] = await Promise.all([
    getAllSeriesWithPostsPreview(3),
    getSeriesRegistry(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Series</h1>

      {seriesList.length === 0 ? (
        <p className="text-primary-700">시리즈가 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seriesList.map((series) => (
            <li key={series.id}>
              <Link
                href={`/series/${encodeURIComponent(series.id)}`}
                className="group block rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors overflow-hidden"
              >
                <div className="relative w-full h-36 bg-primary-100">
                  <GeneratedThumbnail
                    title={series.title}
                    className="w-full h-full"
                    bgColor={registry[series.id]?.color}
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
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{series.title}</h2>
                    <span className="text-sm text-primary-600">
                      {series.count}개
                    </span>
                  </div>
                  {series.description && (
                    <p className="text-sm text-primary-700 mt-1 line-clamp-2">
                      {series.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeriesPage;
