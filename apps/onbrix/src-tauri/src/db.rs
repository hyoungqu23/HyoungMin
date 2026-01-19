use crate::types::{ProductItem, RankHistory};
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
}
