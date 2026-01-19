use tauri::{AppHandle, Emitter, Manager, State};

mod crawler;
mod db;
mod scheduler;
mod types;

use db::DbHandle;
use types::{ProductItem, RankHistory};

// State wrapper
struct AppState {
    db: DbHandle,
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
        .invoke_handler(tauri::generate_handler![
            manual_crawl, 
            search_brand_rankings, 
            get_product_history
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
