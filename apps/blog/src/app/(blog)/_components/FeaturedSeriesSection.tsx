import Link from "next/link";

import type { HomePageData } from "../_lib/home-page-data";

import { SeriesCard } from "@/widgets/series-card/SeriesCard";

type FeaturedSeriesSectionProps = {
  series: HomePageData["topSeries"];
  seriesRegistry: HomePageData["seriesRegistry"];
};

export const FeaturedSeriesSection = ({
  series,
  seriesRegistry,
}: FeaturedSeriesSectionProps) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Series</h2>
      <Link
        href="/series"
        className="text-sm text-primary-600 hover:text-secondary-400 transition-colors"
      >
        모든 시리즈 →
      </Link>
    </div>
    {series.length === 0 ? (
      <p className="text-primary-700">시리즈가 없습니다.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {series.map((item) => (
          <SeriesCard
            key={item.id}
            series={item}
            color={seriesRegistry[item.id]?.color}
            variant="featured"
          />
        ))}
      </div>
    )}
  </section>
);
