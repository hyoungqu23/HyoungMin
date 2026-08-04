import { getAllPostSummaries } from "@/shared/lib/posts";
import { getSeriesRegistry, type SeriesRegistry } from "@/shared/lib/series";
import {
  selectPublishedPosts,
  selectTopCategoriesByLatestPost,
  summarizeSeriesWithPostsPreview,
  summarizeTags,
  type PostSummary,
} from "@/shared/lib/taxonomies";

type HomePageSource = {
  posts: PostSummary[];
  seriesRegistry: SeriesRegistry;
};

export const buildHomePageData = ({
  posts,
  seriesRegistry,
}: HomePageSource) => {
  const publishedPosts = selectPublishedPosts(posts);
  const seriesList = summarizeSeriesWithPostsPreview(
    publishedPosts,
    seriesRegistry,
    3,
  );
  const tagsByCount = summarizeTags(publishedPosts).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name, "ko");
  });

  return {
    latestPosts: publishedPosts.slice(0, 9).map((post) => ({
      ...post,
      seriesColor: post.meta.series
        ? seriesRegistry[post.meta.series]?.color
        : undefined,
    })),
    topSeries: seriesList.slice(0, 3),
    topCategories: selectTopCategoriesByLatestPost(publishedPosts, 10),
    topTags: tagsByCount.slice(0, 20),
    seriesRegistry,
  };
};

export type HomePageData = ReturnType<typeof buildHomePageData>;

export const getHomePageData = async (): Promise<HomePageData> => {
  const [posts, seriesRegistry] = await Promise.all([
    getAllPostSummaries(),
    getSeriesRegistry(),
  ]);

  return buildHomePageData({ posts, seriesRegistry });
};
