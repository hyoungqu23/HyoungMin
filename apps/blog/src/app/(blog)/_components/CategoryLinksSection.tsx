import Link from "next/link";

import type { HomePageData } from "../_lib/home-page-data";

type CategoryLinksSectionProps = {
  categories: HomePageData["topCategories"];
};

export const CategoryLinksSection = ({
  categories,
}: CategoryLinksSectionProps) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Categories</h2>
      <Link
        href="/categories"
        className="text-sm text-primary-600 hover:text-secondary-400 transition-colors"
      >
        모든 카테고리 →
      </Link>
    </div>
    {categories.length === 0 ? (
      <p className="text-primary-700">카테고리가 없습니다.</p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/categories/${encodeURIComponent(category.name)}`}
            className="px-3 py-1 text-sm border rounded hover:bg-primary-50 transition-colors"
          >
            {category.name}{" "}
            <span className="text-primary-500">({category.count})</span>
          </Link>
        ))}
      </div>
    )}
  </section>
);
