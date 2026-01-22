use tauri::{AppHandle, Emitter, Manager, State};

mod crawler;
mod db;
mod export;
mod scheduler;
mod types;

use db::DbHandle;
use types::{ManagedProductWithRank, ProductItem, RankHistory, ReviewStats, ReviewWithMeta};

// State wrapper
pub struct AppState {
    pub db: DbHandle,
}

#[tauri::command]
async fn manual_crawl(app: AppHandle, state: State<'_, AppState>, category_id: i32) -> Result<i64, String> {
    let db = state.db.clone();
    
    // Spawn blocking crawler
    let res = tokio::task::spawn_blocking(move || crawler::crawl_category(category_id))
        .await
        .map_err(|e| e.to_string())?;

    match res {
        Ok(crawl_result) => {
             let count = crawl_result.items.len() as i32;
             let session_id = db.save_session(
                crawl_result.category_id, 
                crawl_result.source_url, 
                "SUCCESS".to_string(), 
                count, 
                None, 
                crawl_result.items
            ).await.map_err(|e| e.to_string())?;
            
            // Emit refresh event
            let _ = app.emit("refresh-needed", ());
            
            Ok(session_id)
        },
        Err(e) => {
            let _ = db.save_session(category_id, "".to_string(), "FAILED".to_string(), 0, Some(e.to_string()), vec![])
                .await
                .map_err(|e| e.to_string())?;
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn search_brand_rankings(state: State<'_, AppState>, keyword: String) -> Result<Vec<ProductItem>, String> {
    println!("[Command] search_brand_rankings called with keyword: '{}'", keyword);
    let res = state.db.search_brand(keyword).await.map_err(|e| e.to_string());
    match &res {
        Ok(items) => println!("[Command] search_brand_rankings returning {} items", items.len()),
        Err(e) => println!("[Command] search_brand_rankings failed: {}", e),
    }
    res
}

#[tauri::command]
async fn get_product_history(state: State<'_, AppState>, product_id: String) -> Result<Vec<RankHistory>, String> {
    state.db.get_history(product_id).await.map_err(|e| e.to_string())
}

// ===== Managed Products Commands =====

#[tauri::command]
async fn sync_brand_products(app: AppHandle, state: State<'_, AppState>, brand_id: String) -> Result<usize, String> {
    println!("[Command] sync_brand_products called for brand_id: {}", brand_id);
    
    // 진행률 이벤트 발생
    let _ = app.emit("brand-sync-progress", serde_json::json!({
        "status": "syncing",
        "message": "브랜드 상품 동기화 중..."
    }));
    
    let brand_id_clone = brand_id.clone();
    let res = tokio::task::spawn_blocking(move || crawler::crawl_brand_products(&brand_id_clone))
        .await
        .map_err(|e| e.to_string())?;

    match res {
        Ok(result) => {
            let count = result.items.len();
            state.db.upsert_managed_products(result.items)
                .await
                .map_err(|e| e.to_string())?;
            
            let _ = app.emit("brand-sync-progress", serde_json::json!({
                "status": "completed",
                "message": format!("{}개 상품 동기화 완료", count),
                "count": count
            }));
            let _ = app.emit("refresh-needed", ());
            
            Ok(count)
        }
        Err(e) => {
            let _ = app.emit("brand-sync-progress", serde_json::json!({
                "status": "error",
                "message": format!("크롤링 실패: {}", e)
            }));
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn get_managed_products_with_rank(state: State<'_, AppState>) -> Result<Vec<ManagedProductWithRank>, String> {
    println!("[Command] get_managed_products_with_rank called");
    let res = state.db.get_managed_products_with_rank().await.map_err(|e| e.to_string());
    match &res {
        Ok(items) => println!("[Command] get_managed_products_with_rank returning {} items", items.len()),
        Err(e) => println!("[Command] get_managed_products_with_rank failed: {}", e),
    }
    res
}

// ===== Product Reviews Commands =====

#[tauri::command]
async fn get_product_reviews(state: State<'_, AppState>, product_id: String, limit: Option<i32>) -> Result<Vec<ReviewWithMeta>, String> {
    println!("[Command] get_product_reviews called for product_id: {}", product_id);
    state.db.get_product_reviews(product_id, limit).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_review_stats(state: State<'_, AppState>, product_id: String) -> Result<ReviewStats, String> {
    println!("[Command] get_review_stats called for product_id: {}", product_id);
    state.db.get_review_stats(product_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn manual_review_crawl(app: AppHandle, state: State<'_, AppState>, product_id: String, since_date: String) -> Result<usize, String> {
    println!("[Command] manual_review_crawl called for product_id: {}, since: {}", product_id, since_date);
    
    let _ = app.emit("review-crawl-progress", serde_json::json!({
        "status": "starting",
        "message": "리뷰 크롤링 시작..."
    }));

    let pid = product_id.clone();
    let date = since_date.clone();
    let res = tokio::task::spawn_blocking(move || crawler::crawl_reviews(&pid, &date))
        .await
        .map_err(|e| e.to_string())?;

    match res {
        Ok(reviews) => {
            let count = reviews.len();
            if count > 0 {
                let saved = state.db.save_reviews(product_id, reviews)
                    .await
                    .map_err(|e| e.to_string())?;
                
                let _ = app.emit("review-crawl-progress", serde_json::json!({
                    "status": "completed",
                    "message": format!("{}개 리뷰 저장 완료", saved)
                }));
                let _ = app.emit("refresh-needed", ());
                
                Ok(saved)
            } else {
                let _ = app.emit("review-crawl-progress", serde_json::json!({
                    "status": "completed",
                    "message": "새로운 리뷰가 없습니다"
                }));
                Ok(0)
            }
        }
        Err(e) => {
            let _ = app.emit("review-crawl-progress", serde_json::json!({
                "status": "error",
                "message": format!("크롤링 실패: {}", e)
            }));
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn crawl_recent_reviews(app: AppHandle, state: State<'_, AppState>, months: i32) -> Result<usize, String> {
    println!("[Command] crawl_recent_reviews called for recent {} months", months);
    
    // Calculate since_date
    let since_date = chrono::Local::now()
        .checked_sub_signed(chrono::Duration::days((months * 30) as i64))
        .map(|d| d.format("%Y-%m-%d").to_string())
        .unwrap_or_else(|| "".to_string());
        
    if since_date.is_empty() {
        return Err("Failed to calculate date".to_string());
    }
    
    // Get all active product IDs
    let product_ids = state.db.get_active_product_ids().await.map_err(|e| e.to_string())?;
    let total_products = product_ids.len();
    let mut total_saved = 0;
    
    println!("[Command] Starting bulk crawl for {} products since {}", total_products, since_date);
    
    // Process in background (async) but emit progress
    let app_handle = app.clone();
    let db_handle = state.db.clone();
    
    tokio::spawn(async move {
        for (i, pid) in product_ids.iter().enumerate() {
            let _ = app_handle.emit("review-crawl-progress", serde_json::json!({
                "status": "crawling",
                "message": format!("최근 리뷰 수집 중... ({}/{})", i + 1, total_products),
                "current": i + 1,
                "total": total_products
            }));
            
            let p_clone = pid.clone();
            let d_clone = since_date.clone();
            
            // Blocking crawl call
            let res = tokio::task::spawn_blocking(move || crawler::crawl_reviews(&p_clone, &d_clone)).await;
            
            match res {
                Ok(Ok(reviews)) => {
                    if !reviews.is_empty() {
                        if let Ok(saved) = db_handle.save_reviews(pid.clone(), reviews).await {
                             total_saved += saved;
                        }
                    }
                }
                Ok(Err(e)) => eprintln!("[BulkCrawl] Error crawling {}: {}", pid, e),
                Err(e) => eprintln!("[BulkCrawl] Task join error: {}", e),
            }
            
            // Rate limit
            tokio::time::sleep(std::time::Duration::from_secs(2)).await;
        }
        
        println!("[BulkCrawl] Completed. Total new reviews saved: {}", total_saved);
        let _ = app_handle.emit("review-crawl-progress", serde_json::json!({
            "status": "completed",
            "message": format!("전체 수집 완료 ({}개 리뷰 저장됨)", total_saved)
        }));
        let _ = app_handle.emit("refresh-needed", ());
    });

    Ok(total_products) // Return immediately that task started
}

#[tauri::command]
async fn get_all_reviews(state: State<'_, AppState>, limit: Option<i32>) -> Result<Vec<ReviewWithMeta>, String> {
    state.db.get_all_reviews(limit).await.map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            
            tauri::async_runtime::block_on(async move {
                let app_dir = handle.path().app_data_dir().expect("failed to get app data dir");
                if !app_dir.exists() {
                     let _ = std::fs::create_dir_all(&app_dir);
                }
                let db_path = app_dir.join("onbrix.db");
                let db = DbHandle::new(db_path).await.expect("Failed to init DB");
                
                // Init Schema
                let schema = include_str!("../schema.sql").to_string();
                db.init(schema).await.expect("Failed to create tables");
                
                // Start scheduler
                scheduler::start_scheduler(handle.clone(), db.clone()).await;
                
                handle.manage(AppState { db });
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            manual_crawl, 
            search_brand_rankings, 
            get_product_history,
            sync_brand_products,
            get_managed_products_with_rank,
            get_product_reviews,
            get_review_stats,
            manual_review_crawl,
            crawl_recent_reviews,
            get_all_reviews,
            export::export_rankings_excel,
            export::export_reviews_excel
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
