use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductItem {
    pub rank: i32,
    pub product_id: String,
    pub product_name: String,
    pub brand_name: String,
    pub price: i32,
    pub product_link: String,
    pub img_thumb: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CrawlResult {
    pub category_id: i32,
    pub source_url: String,
    pub items: Vec<ProductItem>,
}

#[derive(Debug, Serialize)]
pub struct RankHistory {
    pub date: String,
    pub rank: i32,
}

// ===== Managed Products (자사 상품 마스터) =====

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ManagedProduct {
    pub product_id: String,
    pub product_name: String,
    pub product_image_url: Option<String>,
    pub brand_id: String,
    pub brand_name: String,
    pub is_active: bool,
    pub last_updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ManagedProductWithRank {
    pub product_id: String,
    pub product_name: String,
    pub product_image_url: Option<String>,
    pub brand_name: String,
    pub is_active: bool,
    pub current_rank: Option<i32>,  // None = 순위 밖
    pub previous_rank: Option<i32>, // 추가: 이전 랭킹
}

#[derive(Debug)]
#[allow(dead_code)]
pub struct BrandCrawlResult {
    pub brand_id: String,  // 향후 다중 브랜드 지원용
    pub items: Vec<ManagedProduct>,
}
