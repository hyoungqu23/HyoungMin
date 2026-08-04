import { CategoryLinksSection } from "./_components/CategoryLinksSection";
import { FeaturedSeriesSection } from "./_components/FeaturedSeriesSection";
import { LatestPostsSection } from "./_components/LatestPostsSection";
import { TagLinksSection } from "./_components/TagLinksSection";
import { getHomePageData } from "./_lib/home-page-data";

const Home = async () => {
  const { latestPosts, topSeries, topCategories, topTags, seriesRegistry } =
    await getHomePageData();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <LatestPostsSection posts={latestPosts} />
      <FeaturedSeriesSection
        series={topSeries}
        seriesRegistry={seriesRegistry}
      />
      <CategoryLinksSection categories={topCategories} />
      <TagLinksSection tags={topTags} />
    </div>
  );
};

export default Home;
