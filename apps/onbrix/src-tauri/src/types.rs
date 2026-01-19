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
