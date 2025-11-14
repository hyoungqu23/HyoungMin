import Link from "next/link";
import type { PostMeta } from "@hyoungmin/schema";

interface PostListProps {
  slug: string;
  meta: PostMeta;
}

export const PostList = ({ slug, meta }: PostListProps) => {
  return (
    <li>
      <Link
        href={`/${slug}`}
        className="block p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
      >
        <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {meta.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {meta.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <time>
            {meta.createdAt.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {meta.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </Link>
    </li>
  );
};
