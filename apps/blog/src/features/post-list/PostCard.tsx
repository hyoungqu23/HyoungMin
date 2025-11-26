import type { PostMeta } from "@hyoungmin/schema";
import Image from "next/image";
import Link from "next/link";

import { GeneratedThumbnail } from "./GeneratedThumbnail";
import { TagList } from "./TagList";

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
    <div className="perspective-distant">
      <Link
        href={`/${slug}`}
        className="group block h-full rounded-lg border border-primary-200 overflow-hidden bg-primary-50 hover:border-primary-300 transform-gpu transition-transform duration-300 hover:shadow-lg hover:transform-[rotateX(4deg)_rotateY(-3deg)_translateY(-4px)]"
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
          <p className="text-primary-700 text-sm line-clamp-1 mb-4">
            {meta.description}
          </p>
          <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-between text-xs text-primary-600">
            <time dateTime={meta.createdAt.toISOString()}>
              {meta.createdAt.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <TagList tags={meta.tags} limit={2} />
          </div>
        </div>
      </Link>
    </div>
  );
};
