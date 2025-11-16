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
        className="block p-4 rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
      >
        <h2 className="text-2xl font-semibold mb-2 hover:text-secondary-400 transition-colors">
          {meta.title}
        </h2>
        <p className="text-primary-700 mb-2">{meta.description}</p>
        <div className="flex items-center gap-4 text-sm text-primary-600">
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
                    className="px-2 py-1 text-xs bg-primary-100 rounded"
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
