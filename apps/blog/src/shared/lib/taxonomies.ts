import type { PostMeta } from "@hyoungmin/schema";

import { getSeriesRegistry, type SeriesRegistry } from "./series";
import { getAllPostSummaries } from "./posts";

export type PostSummary = Awaited<
  ReturnType<typeof getAllPostSummaries>
>[number];

export const selectPublishedPosts = (posts: PostSummary[]): PostSummary[] =>
  [...posts]
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());

const getPublishedPosts = async (): Promise<PostSummary[]> =>
  selectPublishedPosts(await getAllPostSummaries());

export type CategorySummary = {
  name: string;
  count: number;
};

export const summarizeCategories = (
  posts: PostSummary[],
): CategorySummary[] => {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const category = post.meta.category;
    if (!category) continue;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name, "ko"),
  );
};

export const getAllCategories = async (): Promise<CategorySummary[]> =>
  summarizeCategories(await getPublishedPosts());

export const filterPostsByCategory = (
  posts: PostSummary[],
  categoryName: string,
): PostSummary[] => posts.filter((post) => post.meta.category === categoryName);

export const getPostsByCategory = async (
  categoryName: string,
): Promise<PostSummary[]> => {
  const posts = await getPublishedPosts();
  return filterPostsByCategory(posts, categoryName);
};

export type TagSummary = {
  name: string;
  count: number;
};

export const summarizeTags = (posts: PostSummary[]): TagSummary[] => {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.meta.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name, "ko"),
  );
};

export const getAllTags = async (): Promise<TagSummary[]> =>
  summarizeTags(await getPublishedPosts());

export const filterPostsByTag = (
  posts: PostSummary[],
  tagName: string,
): PostSummary[] => posts.filter((post) => post.meta.tags.includes(tagName));

export const getPostsByTag = async (
  tagName: string,
): Promise<PostSummary[]> => {
  const posts = await getPublishedPosts();
  return filterPostsByTag(posts, tagName);
};

export type SeriesSummary = {
  id: NonNullable<PostMeta["series"]>;
  title: string;
  description?: string;
  cover?: string;
  count: number;
};

const groupPostsBySeries = (posts: PostSummary[]) => {
  const map = new Map<string, PostSummary[]>();

  for (const post of posts) {
    const id = post.meta.series;
    if (!id) continue;
    const existing = map.get(id);
    if (existing) {
      existing.push(post);
    } else {
      map.set(id, [post]);
    }
  }

  return map;
};

export const summarizeSeries = (
  posts: PostSummary[],
  registry: SeriesRegistry,
): SeriesSummary[] => {
  const map = groupPostsBySeries(posts);

  return Array.from(map, ([id, seriesPosts]) => {
    const info = registry[id];
    return {
      id,
      title: info?.title ?? id,
      description: info?.description,
      cover: info?.cover,
      count: seriesPosts.length,
    };
  }).sort((a, b) => a.title.localeCompare(b.title, "ko"));
};

export const getAllSeries = async (): Promise<SeriesSummary[]> => {
  const [posts, registry] = await Promise.all([
    getPublishedPosts(),
    getSeriesRegistry(),
  ]);
  return summarizeSeries(posts, registry);
};

export const sortPostsInSeries = (posts: PostSummary[]): PostSummary[] =>
  [...posts].sort((a, b) => {
    const aOrder = a.meta.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.meta.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.meta.createdAt.getTime() - b.meta.createdAt.getTime();
  });

export const getPostsBySeries = async (seriesId: string) => {
  const posts = await getPublishedPosts();
  return sortPostsInSeries(
    posts.filter((post) => post.meta.series === seriesId),
  );
};

export type SeriesWithPostsPreview = SeriesSummary & {
  latestAt: Date;
  previewPosts: PostSummary[];
};

export const summarizeSeriesWithPostsPreview = (
  posts: PostSummary[],
  registry: SeriesRegistry,
  previewCount: number = 3,
): SeriesWithPostsPreview[] => {
  const map = groupPostsBySeries(posts);

  const seriesList = Array.from(map, ([id, seriesPosts]) => {
    const info = registry[id];
    const previewSortedPosts = [...seriesPosts].sort(
      (a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime(),
    );
    const latestAt = seriesPosts.reduce(
      (max, p) => (p.meta.createdAt > max ? p.meta.createdAt : max),
      seriesPosts[0]?.meta.createdAt ?? new Date(0),
    );

    return {
      id,
      title: info?.title ?? id,
      description: info?.description,
      cover: info?.cover,
      count: seriesPosts.length,
      latestAt,
      previewPosts: previewSortedPosts.slice(0, previewCount),
    };
  });

  return seriesList.sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime());
};

export const getAllSeriesWithPostsPreview = async (
  previewCount: number = 3,
): Promise<SeriesWithPostsPreview[]> => {
  const [posts, registry] = await Promise.all([
    getPublishedPosts(),
    getSeriesRegistry(),
  ]);
  return summarizeSeriesWithPostsPreview(posts, registry, previewCount);
};

export type CategoryLatestSummary = CategorySummary & { latestAt: Date };

export const selectTopCategoriesByLatestPost = (
  posts: PostSummary[],
  limit: number,
): CategoryLatestSummary[] => {
  const map = new Map<string, { count: number; latestAt: Date }>();

  for (const post of posts) {
    const category = post.meta.category;
    if (!category) continue;
    const existing = map.get(category);
    if (!existing) {
      map.set(category, { count: 1, latestAt: post.meta.createdAt });
    } else {
      existing.count += 1;
      if (post.meta.createdAt > existing.latestAt) {
        existing.latestAt = post.meta.createdAt;
      }
    }
  }

  return Array.from(map, ([name, { count, latestAt }]) => ({
    name,
    count,
    latestAt,
  }))
    .sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime())
    .slice(0, limit);
};

export const getTopCategoriesByLatestPost = async (
  limit: number,
): Promise<CategoryLatestSummary[]> =>
  selectTopCategoriesByLatestPost(await getPublishedPosts(), limit);
