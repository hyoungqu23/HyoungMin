use crate::crawler::{crawl_brand_products, crawl_category};
use crate::db::DbHandle;
use chrono::{Local, NaiveDate};
use std::time::Duration;
use tauri::{AppHandle, Emitter};
use tokio::time::sleep;

// 하드코딩된 브랜드 ID (당분간 사용)
const BRAND_ID: &str = "9839";

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
            // Default 30 min interval
            sleep(Duration::from_secs(30 * 60)).await;

            println!("[Scheduler] Starting auto-crawl...");
            run_crawl_once(&app_clone, &db_clone, category_id).await;
        }
    });

    // 브랜드 동기화 스케줄러 (앱 시작 시 체크 + 매일 08:00)
    tokio::spawn(async move {
        // 앱 시작 시: 오늘 동기화 안 됐으면 즉시 실행
        let last_sync = db.get_last_managed_sync(BRAND_ID.to_string()).await.ok().flatten();
        
        if !is_synced_today(&last_sync) {
            println!("[Scheduler] Brand sync needed - last sync: {:?}", last_sync);
            run_brand_sync(&app, &db, BRAND_ID).await;
        } else {
            println!("[Scheduler] Brand already synced today, skipping initial sync");
        }

        // 이후 매일 08:00에 실행 (간단한 구현: 1시간마다 체크)
        loop {
            sleep(Duration::from_secs(60 * 60)).await; // 1시간마다 체크
            
            let now = Local::now();
            // 08:00 ~ 08:59 사이이고 오늘 동기화 안 됐으면 실행
            if now.format("%H").to_string() == "08" {
                let last_sync = db.get_last_managed_sync(BRAND_ID.to_string()).await.ok().flatten();
                if !is_synced_today(&last_sync) {
                    println!("[Scheduler] 08:00 scheduled brand sync triggered");
                    run_brand_sync(&app, &db, BRAND_ID).await;
                }
            }
        }
    });
}
