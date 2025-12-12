import Link from "next/link";

import { getAllSeries } from "@/shared/lib/taxonomies";

export const metadata = {
  title: "Series",
};

const SeriesPage = async () => {
  const seriesList = await getAllSeries();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Series</h1>

      {seriesList.length === 0 ? (
        <p className="text-primary-700">시리즈가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {seriesList.map((series) => (
            <li key={series.id}>
              <Link
                href={`/series/${encodeURIComponent(series.id)}`}
                className="block p-4 rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{series.title}</h2>
                  <span className="text-sm text-primary-600">
                    {series.count}개
                  </span>
                </div>
                {series.description && (
                  <p className="text-sm text-primary-700 mt-1 line-clamp-2">
                    {series.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeriesPage;
