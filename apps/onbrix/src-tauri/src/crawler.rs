use crate::types::{CrawlResult, ProductItem};
use anyhow::Result;
use headless_chrome::{Browser, LaunchOptions};
use std::ffi::OsStr;
use std::thread::sleep;
use std::time::Duration;

pub fn crawl_category(category_id: i32) -> Result<CrawlResult> {
    println!("[Crawler] Starting crawl for category {}", category_id);
    let url = format!("https://gift.kakao.com/ranking/category/{}", category_id);

    // Chrome Launch Options with User-Agent
    println!("[Crawler] Launching Headless Chrome...");
    let browser = Browser::new(LaunchOptions {
        headless: true,
        args: vec![OsStr::new("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")],
        ..Default::default()
    })?;

    println!("[Crawler] Browser launched. Opening new tab...");
    let tab = browser.new_tab()?;
    
    println!("[Crawler] Navigating to: {}", url);
    tab.navigate_to(&url)?;

    // Wait for initial render
    println!("[Crawler] Waiting for selector 'ol.list_prd > li[data-product-id]'");
    let _ = tab.wait_for_element("ol.list_prd > li[data-product-id]");
    println!("[Crawler] Selector found. Starting polling...");

    // Polling for items to load (SPA)
    for i in 0..20 {
        // Scroll to bottom to trigger lazy load
        tab.evaluate("window.scrollTo(0, document.body.scrollHeight)", false)?;
        
        let count_res = tab.evaluate("document.querySelectorAll('ol.list_prd > li[data-product-id]').length", true);
        if let Ok(val) = count_res {
             if let Some(cnt) = val.value.and_then(|v| v.as_i64()) {
                 println!("[Crawler] Poll #{}: Found {} items", i, cnt);
                 if cnt >= 80 { break; } // Tweak threshold as needed
             }
        }
        sleep(Duration::from_millis(500));
    }

    println!("[Crawler] Polling done. Executing extraction JS...");

    // Simplified JS extraction
    let js_script = r#"
    (function() {
        var items = [];
        var lis = document.querySelectorAll("ol.list_prd > li[data-product-id]");
        
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var product_id = li.getAttribute("data-product-id") || "unknown";
            
            var a = li.querySelector("a.link_info");
            var product_link = a ? a.href : "";
            
            var brandEl = li.querySelector(".info_prd .txt_brand");
            var brand_name = brandEl ? brandEl.textContent.trim() : "Unknown";
            
            var p_name = "";
            var t1 = li.querySelector(".info_prd .txt_prdname");
            var t2 = li.querySelector(".info_prd .txt_prod");
            if (t1) p_name = t1.textContent.trim();
            else if (t2) p_name = t2.textContent.trim();
            
            var rankEl = li.querySelector(".thumb_prd .num_rank");
            var rankText = rankEl ? rankEl.textContent.replace(/[^\d]/g, "") : "";
            var rank = rankText ? parseInt(rankText, 10) : (i + 1);
            
            var priceEl = li.querySelector(".info_prd .num_price");
            var priceText = priceEl ? priceEl.textContent.replace(/[^\d]/g, "") : "0";
            var price = parseInt(priceText, 10) || 0;
            
            var imgEl = li.querySelector(".thumb_prd img.img_thumb");
            var img_thumb = imgEl ? imgEl.getAttribute("src") : "";
            
            items.push({
                rank: rank,
                product_id: product_id,
                product_name: p_name,
                brand_name: brand_name,
                price: price,
                product_link: product_link,
                img_thumb: img_thumb
            });
        }
        return JSON.stringify(items);
    })()
    "#;

    println!("[Crawler] Executing JS extraction...");
    let remote_object = tab.evaluate(js_script, true)?;
    
    if remote_object.value.is_none() {
        println!("[Crawler] Error: JS returned no value. Object: {:?}", remote_object);
        return Err(anyhow::anyhow!("JS execution returned undefined"));
    }
    
    let value = remote_object.value.unwrap();
    let json_str = value.as_str().ok_or(anyhow::anyhow!("JS returned non-string value"))?;
    
    println!("[Crawler] JS Executed. Parsing JSON string...");
    let items: Vec<ProductItem> = serde_json::from_str(json_str)?;
    println!("[Crawler] Extracted {} items.", items.len());

    Ok(CrawlResult {
        category_id,
        source_url: url,
        items,
    })
}
