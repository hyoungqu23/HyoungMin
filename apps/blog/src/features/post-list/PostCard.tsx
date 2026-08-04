import type { PostMeta } from "@hyoungmin/schema";
import Link from "next/link";

import { PostThumbnail } from "./PostThumbnail";
import { TagList } from "./TagList";

interface PostCardProps {
  slug: string;
  meta: PostMeta;
  firstImage?: string | null;
  seriesColor?: string;
}

export const PostCard = ({
  slug,
  meta,
  firstImage,
  seriesColor,
}: PostCardProps) => {
  return (
    <article>
      <Link
        href={`/${slug}`}
        className="group block h-full overflow-hidden border border-zinc-300 bg-white transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-zinc-950 hover:shadow-[8px_8px_0_#18181b] dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-stone-50 dark:hover:shadow-[8px_8px_0_#fafaf9]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-zinc-300 dark:border-zinc-700">
          <PostThumbnail
            meta={meta}
            firstImage={firstImage}
            seriesColor={seriesColor}
          />
        </div>
        <div className="flex min-h-52 flex-col p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 text-[0.65rem] font-bold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            <span>{meta.category ?? meta.series ?? "Note"}</span>
            <time dateTime={meta.createdAt.toISOString()}>
              {meta.createdAt.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </time>
          </div>
          <h2 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-zinc-950 transition-colors group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 dark:text-stone-50">
            {meta.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {meta.description}
          </p>
          <div className="mt-auto pt-5">
            <TagList tags={meta.tags} limit={2} />
          </div>
        </div>
      </Link>
    </article>
  );
};
