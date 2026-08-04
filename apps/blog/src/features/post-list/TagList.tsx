import type { PostMeta } from "@hyoungmin/schema";
import Link from "next/link";

type TagListProps = {
  tags: PostMeta["tags"];
  limit?: number;
  linkable?: boolean;
};

export const TagList = ({
  tags,
  limit = tags.length,
  linkable = false,
}: TagListProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, limit).map((tag) =>
        linkable ? (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="border-b border-zinc-400 px-0.5 py-1 text-xs text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-stone-50 dark:hover:text-stone-50"
          >
            {tag}
          </Link>
        ) : (
          <span
            key={tag}
            className="border-b border-zinc-300 px-0.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
          >
            {tag}
          </span>
        ),
      )}
    </div>
  );
};
