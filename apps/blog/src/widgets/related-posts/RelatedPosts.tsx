import Link from "next/link";

import { type PostWithSlug } from "@/shared/lib/related-posts";

export const RelatedPosts = ({
  relatedPosts,
}: {
  relatedPosts: PostWithSlug[];
}) => {
  if (relatedPosts.length === 0) return null;

  return (
    <section className="flex flex-col gap-2 py-8 lg:hidden">
      <h2 className="text-sm font-semibold tracking-tight text-primary-900 flex items-center gap-1">
        <span className="text-base">😎</span>
        <span>다른 글도 읽어보세요</span>
      </h2>

      <div className="grid gap-3">
        {relatedPosts.slice(0, 3).map((relatedPost) => (
          <Link
            key={relatedPost.slug}
            href={`/${relatedPost.slug}`}
            className="group relative block rounded-xl border border-primary-200/80 bg-primary-50/80 px-4 py-3 shadow-sm hover:border-secondary-300 hover:bg-primary-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <h3 className="text-sm font-semibold text-primary-900 mb-1.5 line-clamp-2 group-hover:text-secondary-400 transition-colors">
              {relatedPost.meta.title}
            </h3>
            <p className="text-xs text-primary-700 line-clamp-1 mb-2">
              {relatedPost.meta.description}
            </p>

            <div className="mt-1 flex items-center justify-between gap-2">
              <time className="text-[0.7rem] text-primary-600 whitespace-nowrap">
                {relatedPost.meta.createdAt.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              {relatedPost.meta.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-end">
                  {relatedPost.meta.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
