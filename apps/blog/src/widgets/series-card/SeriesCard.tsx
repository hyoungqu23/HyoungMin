import Link from "next/link";

import { GeneratedThumbnail } from "@/features/post-list/GeneratedThumbnail";
import type { SeriesWithPostsPreview } from "@/shared/lib/taxonomies";

type SeriesCardProps = {
  color?: string;
  series: SeriesWithPostsPreview;
  variant?: "catalog" | "featured";
};

export const SeriesCard = ({
  color,
  series,
  variant = "catalog",
}: SeriesCardProps) => {
  const featured = variant === "featured";
  const Title = featured ? "h3" : "h2";

  return (
    <Link
      href={`/series/${encodeURIComponent(series.id)}`}
      className="group block rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors overflow-hidden"
    >
      <div className="relative w-full h-36 bg-primary-100">
        <GeneratedThumbnail
          title={series.title}
          className="w-full h-full"
          bgColor={color}
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
      <div className={featured ? "p-5" : "p-4"}>
        <div className="flex items-center justify-between">
          <Title className="text-lg font-semibold">{series.title}</Title>
          <span className="text-sm text-primary-600">{series.count}개</span>
        </div>
        {series.description && (
          <p
            className={`text-sm text-primary-700 line-clamp-2 ${featured ? "mt-2" : "mt-1"}`}
          >
            {series.description}
          </p>
        )}
        {featured && (
          <p className="text-xs text-primary-500 mt-2">
            최신 글:{" "}
            {series.latestAt.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </Link>
  );
};
