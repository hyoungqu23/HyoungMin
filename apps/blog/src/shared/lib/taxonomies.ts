import type { PostMeta } from "@hyoungmin/schema";

import { getSeriesRegistry } from "./series";
import { getAllPostSummaries } from "./posts";

export type PostSummary = Awaited<
  ReturnType<typeof getAllPostSummaries>
>[number];

const getPublishedPosts = async (): Promise<PostSummary[]> => {
  const posts = await getAllPostSummaries();
  return posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());
};

export type CategorySummary = {
  name: string;
  count: number;
};

export const getAllCategories = async (): Promise<CategorySummary[]> => {
  const posts = await getPublishedPosts();
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

export const getPostsByCategory = async (
  categoryName: string,
): Promise<PostSummary[]> => {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.meta.category === categoryName);
};

export type TagSummary = {
  name: string;
  count: number;
};

export const getAllTags = async (): Promise<TagSummary[]> => {
  const posts = await getPublishedPosts();
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

export const getPostsByTag = async (
  tagName: string,
): Promise<PostSummary[]> => {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.meta.tags.includes(tagName));
};

export type SeriesSummary = {
  id: NonNullable<PostMeta["series"]>;
  title: string;
  description?: string;
  cover?: string;
  count: number;
};

export const getAllSeries = async (): Promise<SeriesSummary[]> => {
  const posts = await getPublishedPosts();
  const registry = await getSeriesRegistry();
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

export const getPostsBySeries = async (seriesId: string) => {
  const posts = await getPublishedPosts();
  return posts
    .filter((post) => post.meta.series === seriesId)
    .sort((a, b) => {
      const aOrder = a.meta.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.meta.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.meta.createdAt.getTime() - b.meta.createdAt.getTime();
    });
};
