import type { HomePageData } from "./home-page-data";

export type EditorialData = HomePageData;
export type EditorialPost = HomePageData["latestPosts"][number];

export const formatCompactDate = (date: Date) =>
  date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });

export const formatLongDate = (date: Date) =>
  date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const getPostCategory = (post: EditorialPost) =>
  post.meta.category || "Uncategorized";
