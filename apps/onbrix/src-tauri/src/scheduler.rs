use crate::crawler::crawl_category;
use crate::db::DbHandle;
use tauri::{AppHandle, Emitter};
use std::time::Duration;
use tokio::time::sleep;

async fn run_crawl_once(app: &AppHandle, db: &DbHandle, category_id: i32) {
    // Run crawler in blocking thread
    let res = tokio::task::spawn_blocking(move || crawl_category(category_id)).await;

    match res {
        Ok(Ok(crawl_result)) => {
            let count = crawl_result.items.len() as i32;
            let _ = db.save_session(
                crawl_result.category_id, 
                crawl_result.source_url, 
                "SUCCESS".to_string(), 
                count, 
                None, 
                crawl_result.items
            ).await;
            
            println!("[Scheduler] Crawl success. Items: {}", count);
            let _ = app.emit("refresh-needed", ());
        }
        Ok(Err(e)) => {
             eprintln!("[Scheduler] Crawl failed: {}", e);
             let _ = db.save_session(category_id, "".to_string(), "FAILED".to_string(), 0, Some(e.to_string()), vec![]).await;
        }
        Err(e) => eprintln!("[Scheduler] Join error: {}", e),
    }
}

pub async fn start_scheduler(app: AppHandle, db: DbHandle) {
    tokio::spawn(async move {
        let category_id = 4; // Default category

        println!("[Scheduler] Starting initial auto-crawl...");
        run_crawl_once(&app, &db, category_id).await;

        loop {
            // Default 30 min interval
            sleep(Duration::from_secs(30 * 60)).await;
            
            println!("[Scheduler] Starting auto-crawl...");
            run_crawl_once(&app, &db, category_id).await;
        }
    });
}
