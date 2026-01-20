use crate::types::{ManagedProduct, ManagedProductWithRank, ProductItem, RankHistory, ReviewItem, ReviewStats, ReviewWithMeta};
use anyhow::Result;
use rusqlite::{Connection, Row};
use std::path::PathBuf;
use tokio::sync::{mpsc, oneshot};

#[derive(Debug)]
pub enum DbRequest {
    Init {
        schema: String,
        resp: oneshot::Sender<Result<()>>,
    },
    SaveSession {
        category_id: i32,
        source_url: String,
        status: String,
        total_items: i32,
        error_message: Option<String>,
        items: Vec<ProductItem>,
        resp: oneshot::Sender<Result<i64>>,
    },
    SearchBrandLatest {
        brand_name: String,
        resp: oneshot::Sender<Result<Vec<ProductItem>>>, // Returns items from latest session
    },
    GetHistory {
        product_id: String,
        resp: oneshot::Sender<Result<Vec<RankHistory>>>,
    },
    // ===== Managed Products =====
    UpsertManagedProducts {
        products: Vec<ManagedProduct>,
        resp: oneshot::Sender<Result<usize>>,
    },
    GetManagedProductsWithRank {
        resp: oneshot::Sender<Result<Vec<ManagedProductWithRank>>>,
    },
    GetLastManagedSync {
        brand_id: String,
        resp: oneshot::Sender<Result<Option<String>>>,
    },
    // ===== Product Reviews =====
    SaveReviews {
        product_id: String,
        reviews: Vec<ReviewItem>,
        resp: oneshot::Sender<Result<usize>>,
    },
    GetProductReviews {
        product_id: String,
        limit: Option<i32>,
        resp: oneshot::Sender<Result<Vec<ReviewWithMeta>>>,
    },
    GetReviewStats {
        product_id: String,
        resp: oneshot::Sender<Result<ReviewStats>>,
    },
    GetLastReviewCrawl {
        resp: oneshot::Sender<Result<Option<String>>>,
    },
    GetActiveProductIds {
        resp: oneshot::Sender<Result<Vec<String>>>,
    },
}

#[derive(Clone)]
pub struct DbHandle {
    sender: mpsc::Sender<DbRequest>,
}

impl DbHandle {
    fn row_to_product_item(row: &Row<'_>) -> rusqlite::Result<ProductItem> {
        Ok(ProductItem {
            rank: row.get(0)?,
            product_id: row.get(1)?,
            product_name: row.get(2)?,
            brand_name: row.get(3)?,
            price: row.get(4)?,
            product_link: row.get(5)?,
            img_thumb: row.get(6)?,
        })
    }

    pub async fn new(db_path: PathBuf) -> Result<Self> {
        let (sender, mut receiver) = mpsc::channel(32);
        
        std::thread::spawn(move || {
            let conn = Connection::open(db_path).expect("Failed to open DB");
            // Enable WAL for concurrency
            let _ = conn.execute("PRAGMA journal_mode=WAL;", []);
            
            while let Some(msg) = receiver.blocking_recv() {
                match msg {
                    DbRequest::Init { schema, resp } => {
                        let res = (|| -> Result<()> {
                            conn.execute_batch(&schema)?;
                            Ok(())
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::SaveSession { category_id, source_url, status, total_items, error_message, items, resp } => {
                        let res = (|| -> Result<i64> {
                            println!("[DB] SaveSession: Category={}, Items={}, Status={}", category_id, items.len(), status);
                            let tx = conn.unchecked_transaction()?;
                            tx.execute(
                                "INSERT INTO crawl_sessions (category_id, source_url, status, total_items, error_message) VALUES (?1, ?2, ?3, ?4, ?5)",
                                (category_id, &source_url, &status, total_items, &error_message),
                            )?;
                            let session_id = tx.last_insert_rowid();
                            println!("[DB] Session created. ID: {}", session_id);
                            
                            for item in items {
                                tx.execute(
                                    "INSERT INTO ranking_items (session_id, rank, product_id, product_name, brand_name, price, product_link, img_thumb) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                                    (session_id, item.rank, &item.product_id, &item.product_name, &item.brand_name, item.price, &item.product_link, &item.img_thumb),
                                )?;
                            }
                            tx.commit()?;
                            Ok(session_id)
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::SearchBrandLatest { brand_name, resp } => {
                        let res = (|| -> Result<Vec<ProductItem>> {
                            // Find latest successful session
                            let mut stmt = conn.prepare("SELECT id FROM crawl_sessions WHERE status='SUCCESS' ORDER BY id DESC LIMIT 1")?;
                            let session_id: i64 = match stmt.query_row([], |row| row.get(0)) {
                                Ok(id) => id,
                                Err(rusqlite::Error::QueryReturnedNoRows) => {
                                    return Ok(Vec::new());
                                }
                                Err(e) => return Err(e.into()),
                            };
                            let brand_name = brand_name.trim().to_string();
                            
                            let mut items = Vec::new();
                            if brand_name.is_empty() {
                                let mut stmt = conn.prepare(
                                    "SELECT rank, product_id, product_name, brand_name, price, product_link, img_thumb 
                                     FROM ranking_items 
                                     WHERE session_id = ?1
                                     ORDER BY rank ASC"
                                )?;
                                let rows = stmt.query_map([session_id], Self::row_to_product_item)?;
                                for row in rows { items.push(row?); }
                            } else {
                                let mut stmt = conn.prepare(
                                    "SELECT rank, product_id, product_name, brand_name, price, product_link, img_thumb 
                                     FROM ranking_items 
                                     WHERE session_id = ?1 AND brand_name LIKE ?2
                                     ORDER BY rank ASC"
                                )?;
                                let rows = stmt.query_map(
                                    (session_id, format!("%{}%", brand_name)),
                                    Self::row_to_product_item,
                                )?;
                                for row in rows { items.push(row?); }
                            }
                            println!("[DB] SearchBrandLatest '{}' (Session {}): Found {} items", brand_name, session_id, items.len());
                            Ok(items)
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::GetHistory { product_id, resp } => {
                        let res = (|| -> Result<Vec<RankHistory>> {
                            let mut stmt = conn.prepare(
                                "SELECT s.created_at, r.rank 
                                 FROM ranking_items r
                                 JOIN crawl_sessions s ON r.session_id = s.id
                                 WHERE r.product_id = ?1
                                 ORDER BY s.created_at ASC"
                            )?;
                            let rows = stmt.query_map([&product_id], |row| {
                                Ok(RankHistory {
                                    date: row.get(0)?,
                                    rank: row.get(1)?,
                                })
                            })?;
                            let mut history = Vec::new();
                            for row in rows { history.push(row?); }
                            Ok(history)
                        })();
                        let _ = resp.send(res);
                    }
                    // ===== Managed Products Handlers =====
                    DbRequest::UpsertManagedProducts { products, resp } => {
                        let res = (|| -> Result<usize> {
                            println!("[DB] UpsertManagedProducts: {} items", products.len());
                            let tx = conn.unchecked_transaction()?;
                            let mut count = 0;
                            for p in products {
                                tx.execute(
                                    "INSERT INTO managed_products (product_id, product_name, product_image_url, brand_id, brand_name, is_active, last_updated_at)
                                     VALUES (?1, ?2, ?3, ?4, ?5, ?6, datetime('now', 'localtime'))
                                     ON CONFLICT(product_id) DO UPDATE SET
                                       product_name = excluded.product_name,
                                       product_image_url = excluded.product_image_url,
                                       brand_name = excluded.brand_name,
                                       is_active = excluded.is_active,
                                       last_updated_at = datetime('now', 'localtime')",
                                    (&p.product_id, &p.product_name, &p.product_image_url, &p.brand_id, &p.brand_name, p.is_active),
                                )?;
                                count += 1;
                            }
                            tx.commit()?;
                            println!("[DB] Upserted {} managed products", count);
                            Ok(count)
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::GetManagedProductsWithRank { resp } => {
                        let res = (|| -> Result<Vec<ManagedProductWithRank>> {
                            // 최근 성공 세션 2개 조회 (최신순)
                            let mut stmt = conn.prepare("SELECT id FROM crawl_sessions WHERE status='SUCCESS' ORDER BY id DESC LIMIT 2")?;
                            let session_ids: Vec<i64> = stmt.query_map([], |row| row.get(0))?
                                .filter_map(Result::ok)
                                .collect();
                            
                            let latest_session = session_ids.get(0).cloned();
                            let prev_session = session_ids.get(1).cloned();
                            
                            let mut items = Vec::new();
                            let mut stmt = conn.prepare(
                                "SELECT m.product_id, m.product_name, m.product_image_url, m.brand_name, m.is_active, r1.rank, r2.rank
                                 FROM managed_products m
                                 LEFT JOIN ranking_items r1 ON m.product_id = r1.product_id AND r1.session_id = ?1
                                 LEFT JOIN ranking_items r2 ON m.product_id = r2.product_id AND r2.session_id = ?2
                                 WHERE m.is_active = 1
                                 ORDER BY COALESCE(r1.rank, 9999) ASC"
                            )?;
                            let rows = stmt.query_map([latest_session, prev_session], |row| {
                                Ok(ManagedProductWithRank {
                                    product_id: row.get(0)?,
                                    product_name: row.get(1)?,
                                    product_image_url: row.get(2)?,
                                    brand_name: row.get(3)?,
                                    is_active: row.get(4)?,
                                    current_rank: row.get(5)?,
                                    previous_rank: row.get(6)?, // 이전 랭킹
                                })
                            })?;
                            for row in rows { items.push(row?); }
                            println!("[DB] GetManagedProductsWithRank: {} items (Session: {:?}, Prev: {:?})", items.len(), latest_session, prev_session);
                            Ok(items)
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::GetLastManagedSync { brand_id, resp } => {
                        let res = (|| -> Result<Option<String>> {
                            let last: Option<String> = conn.query_row(
                                "SELECT MAX(last_updated_at) FROM managed_products WHERE brand_id = ?1",
                                [&brand_id],
                                |row| row.get(0)
                            ).ok().flatten();
                            Ok(last)
                        })();
                        let _ = resp.send(res);
                    }
                    // ===== Product Reviews Handlers =====
                    DbRequest::SaveReviews { product_id, reviews, resp } => {
                        let res = (|| -> Result<usize> {
                            println!("[DB] SaveReviews: {} reviews for product {}", reviews.len(), product_id);
                            let tx = conn.unchecked_transaction()?;
                            let mut count = 0;
                            for r in reviews {
                                let images_json = serde_json::to_string(&r.images).unwrap_or("[]".to_string());
                                // INSERT OR IGNORE for deduplication
                                let rows_affected = tx.execute(
                                    "INSERT OR IGNORE INTO product_reviews (product_id, review_date, writer_name, rating, content, images_json)
                                     VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                                    (&product_id, &r.review_date, &r.writer_name, r.rating, &r.content, &images_json),
                                )?;
                                if rows_affected > 0 {
                                    count += 1;
                                }
                            }
                            tx.commit()?;
                            println!("[DB] Saved {} new reviews (duplicates ignored)", count);
                            Ok(count)
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::GetProductReviews { product_id, limit, resp } => {
                        let res = (|| -> Result<Vec<ReviewWithMeta>> {
                            let limit_clause = limit.map(|l| format!(" LIMIT {}", l)).unwrap_or_default();
                            let query = format!(
                                "SELECT id, product_id, review_date, writer_name, rating, content, images_json, crawled_at
                                 FROM product_reviews
                                 WHERE product_id = ?1
                                 ORDER BY review_date DESC, id DESC{}",
                                limit_clause
                            );
                            let mut stmt = conn.prepare(&query)?;
                            let rows = stmt.query_map([&product_id], |row| {
                                let images_json: String = row.get(6)?;
                                let images: Vec<String> = serde_json::from_str(&images_json).unwrap_or_default();
                                Ok(ReviewWithMeta {
                                    id: row.get(0)?,
                                    product_id: row.get(1)?,
                                    review_date: row.get(2)?,
                                    writer_name: row.get(3)?,
                                    rating: row.get(4)?,
                                    content: row.get(5)?,
                                    images,
                                    crawled_at: row.get(7)?,
                                })
                            })?;
                            let mut items = Vec::new();
                            for row in rows { items.push(row?); }
                            println!("[DB] GetProductReviews {}: {} items", product_id, items.len());
                            Ok(items)
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::GetReviewStats { product_id, resp } => {
                        let res = (|| -> Result<ReviewStats> {
                            // 어제 날짜 계산
                            let yesterday = chrono::Local::now()
                                .checked_sub_signed(chrono::Duration::days(1))
                                .map(|d| d.format("%Y-%m-%d").to_string())
                                .unwrap_or_default();
                            
                            // 전체 통계
                            let (total_count, average_rating): (i32, f64) = conn.query_row(
                                "SELECT COUNT(*), COALESCE(AVG(rating), 0) FROM product_reviews WHERE product_id = ?1",
                                [&product_id],
                                |row| Ok((row.get(0)?, row.get(1)?))
                            ).unwrap_or((0, 0.0));
                            
                            // 어제 통계
                            let (yesterday_count, yesterday_avg_rating): (i32, f64) = conn.query_row(
                                "SELECT COUNT(*), COALESCE(AVG(rating), 0) FROM product_reviews WHERE product_id = ?1 AND review_date = ?2",
                                [&product_id, &yesterday],
                                |row| Ok((row.get(0)?, row.get(1)?))
                            ).unwrap_or((0, 0.0));
                            
                            Ok(ReviewStats {
                                total_count,
                                average_rating,
                                yesterday_count,
                                yesterday_avg_rating,
                            })
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::GetLastReviewCrawl { resp } => {
                        let res = (|| -> Result<Option<String>> {
                            let last: Option<String> = conn.query_row(
                                "SELECT MAX(crawled_at) FROM product_reviews",
                                [],
                                |row| row.get(0)
                            ).ok().flatten();
                            Ok(last)
                        })();
                        let _ = resp.send(res);
                    }
                    DbRequest::GetActiveProductIds { resp } => {
                        let res = (|| -> Result<Vec<String>> {
                            let mut stmt = conn.prepare(
                                "SELECT product_id FROM managed_products WHERE is_active = 1"
                            )?;
                            let rows = stmt.query_map([], |row| row.get(0))?;
                            let mut ids = Vec::new();
                            for row in rows { ids.push(row?); }
                            println!("[DB] GetActiveProductIds: {} products", ids.len());
                            Ok(ids)
                        })();
                        let _ = resp.send(res);
                    }
                }
            }
        });

        Ok(Self { sender })
    }

    pub async fn init(&self, schema: String) -> Result<()> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::Init { schema, resp: tx }).await?;
        rx.await?
    }

    pub async fn save_session(&self, category_id: i32, url: String, status: String, total: i32, err: Option<String>, items: Vec<ProductItem>) -> Result<i64> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::SaveSession { 
            category_id, source_url: url, status, total_items: total, error_message: err, items, resp: tx 
        }).await?;
        rx.await?
    }
    
    pub async fn search_brand(&self, brand: String) -> Result<Vec<ProductItem>> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::SearchBrandLatest { brand_name: brand, resp: tx }).await?;
        rx.await?
    }

    pub async fn get_history(&self, product_id: String) -> Result<Vec<RankHistory>> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::GetHistory { product_id, resp: tx }).await?;
        rx.await?
    }

    // ===== Managed Products Methods =====
    
    pub async fn upsert_managed_products(&self, products: Vec<ManagedProduct>) -> Result<usize> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::UpsertManagedProducts { products, resp: tx }).await?;
        rx.await?
    }

    pub async fn get_managed_products_with_rank(&self) -> Result<Vec<ManagedProductWithRank>> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::GetManagedProductsWithRank { resp: tx }).await?;
        rx.await?
    }

    pub async fn get_last_managed_sync(&self, brand_id: String) -> Result<Option<String>> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::GetLastManagedSync { brand_id, resp: tx }).await?;
        rx.await?
    }

    // ===== Product Reviews Methods =====

    pub async fn save_reviews(&self, product_id: String, reviews: Vec<ReviewItem>) -> Result<usize> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::SaveReviews { product_id, reviews, resp: tx }).await?;
        rx.await?
    }

    pub async fn get_product_reviews(&self, product_id: String, limit: Option<i32>) -> Result<Vec<ReviewWithMeta>> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::GetProductReviews { product_id, limit, resp: tx }).await?;
        rx.await?
    }

    pub async fn get_review_stats(&self, product_id: String) -> Result<ReviewStats> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::GetReviewStats { product_id, resp: tx }).await?;
        rx.await?
    }

    pub async fn get_last_review_crawl(&self) -> Result<Option<String>> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::GetLastReviewCrawl { resp: tx }).await?;
        rx.await?
    }

    pub async fn get_active_product_ids(&self) -> Result<Vec<String>> {
        let (tx, rx) = oneshot::channel();
        self.sender.send(DbRequest::GetActiveProductIds { resp: tx }).await?;
        rx.await?
    }
}
