use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::Command;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessImageResult {
    /// Path to use in markdown (relative to public folder)
    pub path: String,
    /// Absolute local path of the processed image
    pub local_path: String,
}

/// Process an image: compress and convert to WebP using ffmpeg
#[command]
pub async fn process_image(
    file_name: String,
    data: Vec<u8>,
) -> Result<ProcessImageResult, String> {
    process_image_internal(file_name, data)
        .await
        .map_err(|e| e.to_string())
}

async fn process_image_internal(
    file_name: String,
    data: Vec<u8>,
) -> Result<ProcessImageResult> {
    // Get the blog's public images directory
    let blog_path = get_blog_images_path()?;
    
    // Create a safe filename (slugify)
    let stem = PathBuf::from(&file_name)
        .file_stem()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| "image".to_string());
    
    let safe_name = slugify(&stem);
    let timestamp = chrono::Utc::now().format("%Y%m%d%H%M%S");
    let output_name = format!("{}_{}.webp", safe_name, timestamp);
    
    // Create temp file for input
    let temp_dir = std::env::temp_dir();
    let temp_input = temp_dir.join(&file_name);
    let temp_output = temp_dir.join(&output_name);
    
    // Write input data to temp file
    std::fs::write(&temp_input, &data)
        .context("Failed to write temp input file")?;
    
    // Run ffmpeg to convert and compress
    let output = Command::new("ffmpeg")
        .args([
            "-y",                           // Overwrite output
            "-i", temp_input.to_str().unwrap(),
            "-vf", "scale='min(1200,iw)':'-1'",  // Max width 1200px, maintain aspect ratio
            "-quality", "80",               // WebP quality
            "-compression_level", "6",      // Compression level
            temp_output.to_str().unwrap(),
        ])
        .output()
        .context("Failed to execute ffmpeg")?;
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        anyhow::bail!("ffmpeg failed: {}", stderr);
    }
    
    // Move to blog's public images folder
    let final_path = blog_path.join(&output_name);
    std::fs::copy(&temp_output, &final_path)
        .context("Failed to copy processed image to blog folder")?;
    
    // Cleanup temp files
    let _ = std::fs::remove_file(&temp_input);
    let _ = std::fs::remove_file(&temp_output);
    
    // Return the markdown-friendly path and local path
    let markdown_path = format!("/images/posts/{}", output_name);
    
    Ok(ProcessImageResult {
        path: markdown_path,
        local_path: final_path.to_string_lossy().to_string(),
    })
}

fn get_blog_images_path() -> Result<PathBuf> {
    // Try to find the blog project root
    // This assumes the editor is in the same monorepo as the blog
    let current_dir = std::env::current_dir()?;
    
    // Look for the blog's public/images/posts directory
    let possible_paths = [
        current_dir.join("apps/blog/public/images/posts"),
        current_dir.parent()
            .and_then(|p| p.parent())
            .map(|p| p.join("apps/blog/public/images/posts"))
            .unwrap_or_default(),
        // Fallback: try from home directory
        dirs::home_dir()
            .map(|h| h.join("Developments/HyoungMin/side-project/hyoungmin-tech-blog/apps/blog/public/images/posts"))
            .unwrap_or_default(),
    ];
    
    for path in &possible_paths {
        if path.exists() {
            return Ok(path.clone());
        }
    }
    
    // If not found, create the first path option
    let target = &possible_paths[0];
    std::fs::create_dir_all(target)?;
    Ok(target.clone())
}

fn slugify(s: &str) -> String {
    s.chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() {
                c.to_ascii_lowercase()
            } else if c == ' ' || c == '-' || c == '_' {
                '-'
            } else {
                '_'
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_slugify() {
        assert_eq!(slugify("Hello World"), "hello-world");
        assert_eq!(slugify("Test_Image-01"), "test-image-01");
        assert_eq!(slugify("한글 이미지"), "___-__");
    }
}

