import type { PostMeta } from "@hyoungmin/schema";
import Link from "next/link";

import { PostThumbnail } from "./PostThumbnail";
import { TagList } from "./TagList";

interface PostListProps {
  slug: string;
  meta: PostMeta;
  firstImage?: string | null;
  seriesColor?: string;
}

export const PostList = ({
  slug,
  meta,
  firstImage,
  seriesColor,
}: PostListProps) => {
  return (
    <li className="border-t border-zinc-300 last:border-b dark:border-zinc-700">
      <Link
        href={`/${slug}`}
        className="group grid gap-5 py-5 transition-colors hover:bg-zinc-100/70 sm:grid-cols-[1fr_112px] sm:items-center sm:px-4 dark:hover:bg-zinc-900/70"
      >
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            <span>{meta.category ?? meta.series ?? "Note"}</span>
            <span aria-hidden="true">/</span>
            <time dateTime={meta.createdAt.toISOString()}>
              {meta.createdAt.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </time>
          </div>
          <h2 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-zinc-950 transition-colors group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 dark:text-stone-50 sm:text-2xl">
            {meta.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {meta.description}
          </p>
          <div className="mt-4">
            <TagList tags={meta.tags} limit={2} />
          </div>
        </div>
        <div className="relative hidden aspect-[4/3] w-28 overflow-hidden border border-zinc-300 bg-zinc-200 sm:block dark:border-zinc-700 dark:bg-zinc-800">
          <PostThumbnail
            meta={meta}
            firstImage={firstImage}
            seriesColor={seriesColor}
            compact
          />
        </div>
      </Link>
    </li>
  );
};
