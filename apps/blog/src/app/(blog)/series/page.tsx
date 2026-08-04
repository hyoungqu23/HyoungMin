import { getSeriesRegistry } from "@/shared/lib/series";
import { getAllSeriesWithPostsPreview } from "@/shared/lib/taxonomies";
import { SeriesCard } from "@/widgets/series-card/SeriesCard";

export const metadata = {
  title: "Series",
};

const SeriesPage = async () => {
  const [seriesList, registry] = await Promise.all([
    getAllSeriesWithPostsPreview(3),
    getSeriesRegistry(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Series</h1>

      {seriesList.length === 0 ? (
        <p className="text-primary-700">시리즈가 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seriesList.map((series) => (
            <li key={series.id}>
              <SeriesCard series={series} color={registry[series.id]?.color} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeriesPage;
