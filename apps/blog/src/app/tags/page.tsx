import Link from "next/link";

import { getAllTags } from "@/shared/lib/taxonomies";

export const metadata = {
  title: "Tags",
};

const TagsPage = async () => {
  const tags = await getAllTags();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Tags</h1>

      {tags.length === 0 ? (
        <p className="text-primary-700">태그가 없습니다.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag.name}>
              <Link
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="px-3 py-1 text-sm border rounded hover:bg-primary-50 transition-colors"
              >
                {tag.name}{" "}
                <span className="text-primary-500">({tag.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsPage;
