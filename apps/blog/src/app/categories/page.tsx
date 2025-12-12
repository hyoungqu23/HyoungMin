import Link from "next/link";

import { getAllCategories } from "@/shared/lib/taxonomies";

export const metadata = {
  title: "Categories",
};

const CategoriesPage = async () => {
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-primary-700">카테고리가 없습니다.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="px-3 py-1 text-sm border rounded hover:bg-primary-50 transition-colors"
              >
                {category.name}{" "}
                <span className="text-primary-500">({category.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoriesPage;
