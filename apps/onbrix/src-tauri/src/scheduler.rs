use crate::crawler::{crawl_brand_products, crawl_category, crawl_reviews};
use crate::db::DbHandle;
use chrono::{Duration, Local, NaiveDate};
use std::time::Duration as StdDuration;
use tauri::{AppHandle, Emitter};
use tokio::time::sleep;

// 하드코딩된 브랜드 ID (당분간 사용)
const BRAND_ID: &str = "9839";

/// 리뷰 크롤링 실행 (모든 활성 상품 대상)
async fn run_review_crawl(app: &AppHandle, db: &DbHandle) {
    println!("[Scheduler] Starting review crawl for all active products...");
    
    // 진행률 이벤트
    let _ = app.emit("review-crawl-progress", serde_json::json!({
        "status": "starting",
        "message": "리뷰 크롤링 시작..."
    }));

    // 어제 날짜 계산
    let yesterday = Local::now()
        .checked_sub_signed(Duration::days(1))
        .map(|d| d.format("%Y-%m-%d").to_string())
        .unwrap_or_else(|| "".to_string());

    if yesterday.is_empty() {
        eprintln!("[Scheduler] Failed to calculate yesterday's date");
        return;
    }

    println!("[Scheduler] Target date for reviews: {}", yesterday);

    // 활성 상품 목록 조회
    let product_ids = match db.get_active_product_ids().await {
        Ok(ids) => ids,
        Err(e) => {
            eprintln!("[Scheduler] Failed to get active product IDs: {}", e);
            let _ = app.emit("review-crawl-progress", serde_json::json!({
                "status": "error",
                "message": format!("상품 목록 조회 실패: {}", e)
            }));
            return;
        }
    };

    println!("[Scheduler] Found {} active products", product_ids.len());
    let total = product_ids.len();
    let mut success_count = 0;
    let mut total_reviews = 0;

    for (idx, product_id) in product_ids.iter().enumerate() {
        let _ = app.emit("review-crawl-progress", serde_json::json!({
            "status": "crawling",
            "message": format!("리뷰 수집 중... ({}/{})", idx + 1, total),
            "current": idx + 1,
            "total": total
        }));

        let pid = product_id.clone();
        let date = yesterday.clone();
        
        // 크롤링 실행 (blocking)
        let result = tokio::task::spawn_blocking(move || {
            crawl_reviews(&pid, &date)
        }).await;

        match result {
            Ok(Ok(reviews)) => {
                let count = reviews.len();
                if count > 0 {
                    match db.save_reviews(product_id.clone(), reviews).await {
                        Ok(saved) => {
                            println!("[Scheduler] Saved {} reviews for product {}", saved, product_id);
                            total_reviews += saved;
                        }
                        Err(e) => {
                            eprintln!("[Scheduler] Failed to save reviews for {}: {}", product_id, e);
                        }
                    }
                }
                success_count += 1;
            }
            Ok(Err(e)) => {
                eprintln!("[Scheduler] Review crawl failed for {}: {}", product_id, e);
            }
            Err(e) => {
                eprintln!("[Scheduler] Join error for {}: {}", product_id, e);
            }
        }

        // Rate limiting: 상품 간 2초 대기
        sleep(StdDuration::from_secs(2)).await;
    }

    println!("[Scheduler] Review crawl complete. Success: {}/{}, Total reviews: {}", 
        success_count, total, total_reviews);
    
    let _ = app.emit("review-crawl-progress", serde_json::json!({
        "status": "completed",
        "message": format!("리뷰 수집 완료: {}개 상품에서 {}개 리뷰", success_count, total_reviews),
        "success_count": success_count,
        "total_reviews": total_reviews
    }));
    
    let _ = app.emit("refresh-needed", ());
}

async fn run_crawl_once(app: &AppHandle, db: &DbHandle, category_id: i32) {
    // Run crawler in blocking thread
    let res = tokio::task::spawn_blocking(move || crawl_category(category_id)).await;

    match res {
        Ok(Ok(crawl_result)) => {
            let count = crawl_result.items.len() as i32;
            let _ = db
                .save_session(
                    crawl_result.category_id,
                    crawl_result.source_url,
                    "SUCCESS".to_string(),
                    count,
                    None,
                    crawl_result.items,
                )
                .await;

            println!("[Scheduler] Crawl success. Items: {}", count);
            let _ = app.emit("refresh-needed", ());
        }
        Ok(Err(e)) => {
            eprintln!("[Scheduler] Crawl failed: {}", e);
            let _ = db
                .save_session(
                    category_id,
                    "".to_string(),
                    "FAILED".to_string(),
                    0,
                    Some(e.to_string()),
                    vec![],
                )
                .await;
        }
        Err(e) => eprintln!("[Scheduler] Join error: {}", e),
    }
}

/// 브랜드 상품 동기화 실행
async fn run_brand_sync(app: &AppHandle, db: &DbHandle, brand_id: &str) {
    println!("[Scheduler] Starting brand sync for brand_id: {}", brand_id);
    
    // 진행률 이벤트 발생 (시작)
    let _ = app.emit("brand-sync-progress", serde_json::json!({
        "status": "syncing",
        "message": "브랜드 상품 동기화 중..."
    }));

    let brand_id_owned = brand_id.to_string();
    let res = tokio::task::spawn_blocking(move || crawl_brand_products(&brand_id_owned)).await;

    match res {
        Ok(Ok(result)) => {
            let count = result.items.len();
            match db.upsert_managed_products(result.items).await {
                Ok(_) => {
                    println!("[Scheduler] Brand sync success. Products: {}", count);
                    let _ = app.emit("brand-sync-progress", serde_json::json!({
                        "status": "completed",
                        "message": format!("{}개 상품 동기화 완료", count),
                        "count": count
                    }));
                    let _ = app.emit("refresh-needed", ());
                }
                Err(e) => {
                    eprintln!("[Scheduler] Brand sync DB error: {}", e);
                    let _ = app.emit("brand-sync-progress", serde_json::json!({
                        "status": "error",
                        "message": format!("DB 저장 실패: {}", e)
                    }));
                }
            }
        }
        Ok(Err(e)) => {
            eprintln!("[Scheduler] Brand sync crawl failed: {}", e);
            let _ = app.emit("brand-sync-progress", serde_json::json!({
                "status": "error",
                "message": format!("크롤링 실패: {}", e)
            }));
        }
        Err(e) => {
            eprintln!("[Scheduler] Brand sync join error: {}", e);
            let _ = app.emit("brand-sync-progress", serde_json::json!({
                "status": "error",
                "message": format!("실행 오류: {}", e)
            }));
        }
    }
}

/// 오늘 날짜인지 확인 (last_updated_at이 오늘 00:00 이후인지)
fn is_synced_today(last_sync: &Option<String>) -> bool {
    match last_sync {
        Some(date_str) => {
            // Format: "2026-01-20 08:00:00" (localtime)
            if let Some(date_part) = date_str.split(' ').next() {
                if let Ok(sync_date) = NaiveDate::parse_from_str(date_part, "%Y-%m-%d") {
                    let today = Local::now().date_naive();
                    return sync_date >= today;
                }
            }
            false
        }
        None => false,
    }
}

pub async fn start_scheduler(app: AppHandle, db: DbHandle) {
    let app_clone = app.clone();
    let db_clone = db.clone();

    // 랭킹 크롤러 스케줄러
    tokio::spawn(async move {
        let category_id = 4; // Default category

        println!("[Scheduler] Starting initial auto-crawl...");
        run_crawl_once(&app_clone, &db_clone, category_id).await;

        loop {
            // 1 hour interval (requested by user)
            sleep(StdDuration::from_secs(60 * 60)).await;

            println!("[Scheduler] Starting auto-crawl...");
            run_crawl_once(&app_clone, &db_clone, category_id).await;
        }
    });

    // Clone for brand sync scheduler
    let app_brand = app.clone();
    let db_brand = db.clone();

    // 브랜드 동기화 스케줄러 (앱 시작 시 체크 + 매일 08:00)
    tokio::spawn(async move {
        // 앱 시작 시: 오늘 동기화 안 됐으면 즉시 실행
        let last_sync = db_brand.get_last_managed_sync(BRAND_ID.to_string()).await.ok().flatten();
        
        if !is_synced_today(&last_sync) {
            println!("[Scheduler] Brand sync needed - last sync: {:?}", last_sync);
            run_brand_sync(&app_brand, &db_brand, BRAND_ID).await;
        } else {
            println!("[Scheduler] Brand already synced today, skipping initial sync");
        }

        // 이후 매일 08:00에 실행 (간단한 구현: 1시간마다 체크)
        loop {
            sleep(StdDuration::from_secs(60 * 60)).await; // 1시간마다 체크
            
            let now = Local::now();
            // 08:00 ~ 08:59 사이이고 오늘 동기화 안 됐으면 실행
            if now.format("%H").to_string() == "08" {
                let last_sync = db_brand.get_last_managed_sync(BRAND_ID.to_string()).await.ok().flatten();
                if !is_synced_today(&last_sync) {
                    println!("[Scheduler] 08:00 scheduled brand sync triggered");
                    run_brand_sync(&app_brand, &db_brand, BRAND_ID).await;
                }
            }
        }
    });

    // 리뷰 크롤링 스케줄러 (앱 시작 시 + 매일 00:00 자정)
    let app_review = app.clone();
    let db_review = db.clone();
    tokio::spawn(async move {
        // 앱 시작 시: 오늘 크롤링 안 됐으면 즉시 실행
        let last_crawl = db_review.get_last_review_crawl().await.ok().flatten();
        if !is_synced_today(&last_crawl) {
            println!("[Scheduler] Initial review crawl needed - last crawl: {:?}", last_crawl);
            run_review_crawl(&app_review, &db_review).await;
        } else {
            println!("[Scheduler] Reviews already crawled today, skipping initial crawl");
        }

        // 1시간마다 체크
        loop {
            sleep(StdDuration::from_secs(60 * 60)).await;
            
            let now = Local::now();
            // 00:00 ~ 00:59 사이에 실행
            if now.format("%H").to_string() == "00" {
                let last_crawl = db_review.get_last_review_crawl().await.ok().flatten();
                if !is_synced_today(&last_crawl) {
                    println!("[Scheduler] 00:00 scheduled review crawl triggered");
                    run_review_crawl(&app_review, &db_review).await;
                } else {
                    println!("[Scheduler] Reviews already crawled today, skipping");
                }
            }
        }
    });
}
