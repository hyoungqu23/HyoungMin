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
