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
            className="px-2 py-1 text-xs border rounded hover:bg-primary-50 transition-colors"
          >
            {tag}
          </Link>
        ) : (
          <span key={tag} className="px-2 py-1 text-xs border rounded">
            {tag}
          </span>
        ),
      )}
    </div>
  );
};
