import type { PostMeta } from "@hyoungmin/schema";
import Link from "next/link";

import { TagList } from "./TagList";

interface PostListProps {
  slug: string;
  meta: PostMeta;
}

export const PostList = ({ slug, meta }: PostListProps) => {
  return (
    <li>
      <Link
        href={`/${slug}`}
        className="block p-4 rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold mb-2 hover:text-secondary-400 transition-colors">
            {meta.title}
          </h2>
          <time
            className="whitespace-nowrap"
            dateTime={meta.createdAt.toISOString()}
          >
            {meta.createdAt.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <p className="text-primary-700 mb-2">{meta.description}</p>

        <TagList tags={meta.tags} limit={2} />
      </Link>
    </li>
  );
};
