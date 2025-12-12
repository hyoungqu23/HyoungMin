use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::process::Command;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct PostMetadata {
    pub title: String,
    pub description: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    pub category: Option<String>,
    pub tags: Vec<String>,
    pub series: Option<String>,
    #[serde(rename = "seriesOrder")]
    pub series_order: Option<i32>,
    pub cover: Option<String>,
    pub draft: bool,
}

/// Get the blog project root path
#[command]
pub fn get_blog_path() -> Result<String, String> {
    get_blog_root_path()
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

/// Submit a post to GitHub
#[command]
pub async fn submit_post(
    metadata: PostMetadata,
    content: String,
    local_images: HashMap<String, String>,
) -> Result<(), String> {
    submit_post_internal(metadata, content, local_images)
        .await
        .map_err(|e| e.to_string())
}

/// Save a draft locally
#[command]
pub async fn save_draft(
    metadata: PostMetadata,
    content: String,
) -> Result<(), String> {
    save_draft_internal(metadata, content)
        .await
        .map_err(|e| e.to_string())
}

async fn submit_post_internal(
    metadata: PostMetadata,
    content: String,
    _local_images: HashMap<String, String>,
) -> Result<()> {
    let blog_root = get_blog_root_path()?;
    
    // Generate filename from title
    let filename = generate_slug(&metadata.title);
    let mdx_path = blog_root
        .join("apps/blog/contents/posts")
        .join(format!("{}.mdx", filename));
    
    // Generate MDX content with frontmatter
    let mdx_content = generate_mdx(&metadata, &content);
    
    // Write the MDX file
    std::fs::write(&mdx_path, &mdx_content)
        .context("Failed to write MDX file")?;
    
    println!("Wrote MDX file to: {:?}", mdx_path);
    
    // Git operations
    git_add_commit_push(&blog_root, &metadata.title)?;
    
    Ok(())
}

async fn save_draft_internal(
    metadata: PostMetadata,
    content: String,
) -> Result<()> {
    // Save to a drafts directory in the user's home
    let drafts_dir = dirs::home_dir()
        .context("Could not find home directory")?
        .join(".blog-editor-drafts");
    
    std::fs::create_dir_all(&drafts_dir)?;
    
    let filename = generate_slug(&metadata.title);
    let draft_path = drafts_dir.join(format!("{}.json", filename));
    
    #[derive(Serialize)]
    struct Draft {
        metadata: PostMetadata,
        content: String,
        saved_at: String,
    }
    
    let draft = Draft {
        metadata,
        content,
        saved_at: chrono::Utc::now().to_rfc3339(),
    };
    
    let json = serde_json::to_string_pretty(&draft)?;
    std::fs::write(&draft_path, json)?;
    
    println!("Draft saved to: {:?}", draft_path);
    
    Ok(())
}

fn get_blog_root_path() -> Result<PathBuf> {
    let current_dir = std::env::current_dir()?;
    
    // Look for the monorepo root (has pnpm-workspace.yaml)
    let possible_paths = [
        current_dir.clone(),
        current_dir.parent().map(|p| p.to_path_buf()).unwrap_or_default(),
        current_dir.parent()
            .and_then(|p| p.parent())
            .map(|p| p.to_path_buf())
            .unwrap_or_default(),
        // Fallback: try from home directory
        dirs::home_dir()
            .map(|h| h.join("Developments/HyoungMin/side-project/hyoungmin-tech-blog"))
            .unwrap_or_default(),
    ];
    
    for path in &possible_paths {
        if path.join("pnpm-workspace.yaml").exists() {
            return Ok(path.clone());
        }
    }
    
    anyhow::bail!("Could not find blog project root")
}

fn generate_slug(title: &str) -> String {
    title
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() {
                c.to_ascii_lowercase()
            } else if c == ' ' || c == '-' {
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

fn generate_mdx(metadata: &PostMetadata, content: &str) -> String {
    let mut frontmatter = String::from("---\n");
    
    frontmatter.push_str(&format!("title: {}\n", metadata.title));
    frontmatter.push_str(&format!("description: {}\n", metadata.description));
    frontmatter.push_str(&format!("createdAt: {}\n", metadata.created_at));

    if let Some(category) = &metadata.category {
        frontmatter.push_str(&format!("category: {}\n", category));
    }

    if let Some(series) = &metadata.series {
        frontmatter.push_str(&format!("series: {}\n", series));
    }

    if let Some(series_order) = metadata.series_order {
        frontmatter.push_str(&format!("seriesOrder: {}\n", series_order));
    }
    
    if !metadata.tags.is_empty() {
        frontmatter.push_str("tags:\n");
        for tag in &metadata.tags {
            frontmatter.push_str(&format!("  - {}\n", tag));
        }
    }
    
    if let Some(cover) = &metadata.cover {
        frontmatter.push_str(&format!("cover: {}\n", cover));
    }
    
    if metadata.draft {
        frontmatter.push_str("draft: true\n");
    }
    
    frontmatter.push_str("---\n\n");
    
    format!("{}{}", frontmatter, content)
}

fn git_add_commit_push(repo_path: &PathBuf, title: &str) -> Result<()> {
    // Check for GITHUB_TOKEN environment variable
    let token = std::env::var("GITHUB_TOKEN")
        .context("GITHUB_TOKEN environment variable not set")?;
    
    // Git add
    let add_output = Command::new("git")
        .current_dir(repo_path)
        .args(["add", "-A"])
        .output()
        .context("Failed to execute git add")?;
    
    if !add_output.status.success() {
        let stderr = String::from_utf8_lossy(&add_output.stderr);
        anyhow::bail!("git add failed: {}", stderr);
    }
    
    // Git commit
    let commit_message = format!("feat(blog): add post - {}", title);
    let commit_output = Command::new("git")
        .current_dir(repo_path)
        .args(["commit", "-m", &commit_message])
        .output()
        .context("Failed to execute git commit")?;
    
    if !commit_output.status.success() {
        let stderr = String::from_utf8_lossy(&commit_output.stderr);
        // If nothing to commit, that's okay
        if !stderr.contains("nothing to commit") {
            anyhow::bail!("git commit failed: {}", stderr);
        }
    }
    
    // Get current branch
    let branch_output = Command::new("git")
        .current_dir(repo_path)
        .args(["branch", "--show-current"])
        .output()
        .context("Failed to get current branch")?;
    
    let branch = String::from_utf8_lossy(&branch_output.stdout)
        .trim()
        .to_string();
    
    // Get remote URL and inject token
    let remote_output = Command::new("git")
        .current_dir(repo_path)
        .args(["remote", "get-url", "origin"])
        .output()
        .context("Failed to get remote URL")?;
    
    let remote_url = String::from_utf8_lossy(&remote_output.stdout)
        .trim()
        .to_string();
    
    // Convert to authenticated URL
    let auth_url = if remote_url.starts_with("https://github.com/") {
        remote_url.replace(
            "https://github.com/",
            &format!("https://{}@github.com/", token),
        )
    } else if remote_url.starts_with("git@github.com:") {
        remote_url.replace(
            "git@github.com:",
            &format!("https://{}@github.com/", token),
        )
    } else {
        remote_url
    };
    
    // Git push
    let push_output = Command::new("git")
        .current_dir(repo_path)
        .args(["push", &auth_url, &branch])
        .output()
        .context("Failed to execute git push")?;
    
    if !push_output.status.success() {
        let stderr = String::from_utf8_lossy(&push_output.stderr);
        anyhow::bail!("git push failed: {}", stderr);
    }
    
    println!("Successfully pushed to GitHub!");
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_slug() {
        assert_eq!(generate_slug("Hello World"), "hello-world");
        assert_eq!(generate_slug("Next.js Tutorial"), "next_js-tutorial");
    }

    #[test]
    fn test_generate_mdx() {
        let metadata = PostMetadata {
            title: "Test Post".to_string(),
            description: "A test post".to_string(),
            created_at: "2024-01-01".to_string(),
            category: None,
            tags: vec!["test".to_string(), "rust".to_string()],
            series: None,
            series_order: None,
            cover: None,
            draft: false,
        };
        
        let content = "# Hello\n\nThis is content.";
        let mdx = generate_mdx(&metadata, content);
        
        assert!(mdx.contains("title: Test Post"));
        assert!(mdx.contains("description: A test post"));
        assert!(mdx.contains("tags:"));
        assert!(mdx.contains("  - test"));
        assert!(mdx.contains("# Hello"));
    }
}
