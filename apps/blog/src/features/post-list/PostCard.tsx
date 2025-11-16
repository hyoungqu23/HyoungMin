import type { PostMeta } from "@hyoungmin/schema";
import Image from "next/image";
import Link from "next/link";

import { GeneratedThumbnail } from "./GeneratedThumbnail";

interface PostCardProps {
  slug: string;
  meta: PostMeta;
  firstImage?: string | null;
}

const normalizeImageUrl = (url: string): string => {
  if (url.startsWith("http")) {
    return url;
  }
  if (url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
};

export const PostCard = ({ slug, meta, firstImage }: PostCardProps) => {
  // 썸네일 이미지 우선순위: meta.cover -> firstImage -> GeneratedThumbnail
  const thumbnailImage = meta.cover
    ? normalizeImageUrl(meta.cover)
    : firstImage
      ? normalizeImageUrl(firstImage)
      : null;

  return (
    <Link
      href={`/${slug}`}
      className="group block h-full rounded-lg border border-primary-200 overflow-hidden hover:border-primary-300 transition-colors bg-white"
    >
      <div className="relative w-full h-48 overflow-hidden bg-primary-100">
        {thumbnailImage ? (
          <Image
            src={thumbnailImage}
            alt={meta.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <GeneratedThumbnail title={meta.title} className="w-full h-full" />
        )}
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-secondary-400 transition-colors">
          {meta.title}
        </h2>
        <p className="text-primary-700 text-sm line-clamp-2 mb-4">
          {meta.description}
        </p>
        <div className="flex items-center justify-between text-xs text-primary-600">
          <time>
            {meta.createdAt.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {meta.tags.length > 0 && (
            <div className="flex gap-1">
              {meta.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-primary-100 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
