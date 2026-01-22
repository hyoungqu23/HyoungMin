import { invoke } from "@tauri-apps/api/core";

export interface ProductItem {
  rank: number;
  product_id: string;
  product_name: string;
  brand_name: string;
  price: number;
  product_link: string;
  img_thumb?: string;
}

export interface RankHistory {
  date: string;
  rank: number;
}

export async function manualCrawl(categoryId: number = 4): Promise<number> {
  return invoke("manual_crawl", { categoryId });
}

export async function searchBrandRankings(
  keyword: string,
): Promise<ProductItem[]> {
  return invoke("search_brand_rankings", { keyword });
}

export async function getProductHistory(
  productId: string,
): Promise<RankHistory[]> {
  return invoke("get_product_history", { productId });
}

// ===== Managed Products =====

export interface ManagedProductWithRank {
  product_id: string;
  product_name: string;
  product_image_url?: string;
  brand_name: string;
  is_active: boolean;
  current_rank?: number; // undefined = 순위 밖
  previous_rank?: number; // undefined = 순위 밖
}

export async function syncBrandProducts(brandId: string): Promise<number> {
  return invoke("sync_brand_products", { brandId });
}

export async function getManagedProductsWithRank(): Promise<
  ManagedProductWithRank[]
> {
  return invoke("get_managed_products_with_rank", {});
}

// ===== Product Reviews =====

export interface ReviewWithMeta {
  id: number;
  product_id: string;
  review_date: string;
  writer_name: string;
  rating: number;
  content: string;
  images: string[];
  crawled_at: string;
}

export interface ReviewStats {
  total_count: number;
  average_rating: number;
  yesterday_count: number;
  yesterday_avg_rating: number;
}

export async function getProductReviews(
  productId: string,
  limit?: number,
): Promise<ReviewWithMeta[]> {
  return invoke("get_product_reviews", { productId, limit });
}

export async function getReviewStats(productId: string): Promise<ReviewStats> {
  return invoke("get_review_stats", { productId });
}

export async function manualReviewCrawl(
  productId: string,
  sinceDate: string,
): Promise<number> {
  return invoke("manual_review_crawl", { productId, sinceDate });
}

export async function crawlRecentReviews(months: number): Promise<number> {
  return invoke("crawl_recent_reviews", { months });
}

export async function getAllReviews(limit?: number): Promise<ReviewWithMeta[]> {
  return invoke("get_all_reviews", { limit });
}

export async function exportRankingsExcel(): Promise<void> {
  return invoke("export_rankings_excel");
}

export async function exportReviewsExcel(): Promise<void> {
  return invoke("export_reviews_excel");
}
