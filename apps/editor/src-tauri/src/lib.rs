mod commands;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Load .env file if exists
    let _ = dotenvy::dotenv();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // Get the main window and set up any initial state
            let _main_window = app.get_webview_window("main").unwrap();
            
            // Log startup
            println!("Blog Editor started successfully!");
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::image::process_image,
            commands::github::submit_post,
            commands::github::save_draft,
            commands::github::get_blog_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
