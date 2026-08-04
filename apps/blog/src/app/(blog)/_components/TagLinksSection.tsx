import Link from "next/link";

import type { HomePageData } from "../_lib/home-page-data";

type TagLinksSectionProps = {
  tags: HomePageData["topTags"];
};

export const TagLinksSection = ({ tags }: TagLinksSectionProps) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Tags</h2>
      <Link
        href="/tags"
        className="text-sm text-primary-600 hover:text-secondary-400 transition-colors"
      >
        모든 태그 →
      </Link>
    </div>
    {tags.length === 0 ? (
      <p className="text-primary-700">태그가 없습니다.</p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className="px-3 py-1 text-sm border rounded hover:bg-primary-50 transition-colors"
          >
            {tag.name} <span className="text-primary-500">({tag.count})</span>
          </Link>
        ))}
      </div>
    )}
  </section>
);
