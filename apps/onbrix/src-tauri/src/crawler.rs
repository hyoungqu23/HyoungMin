use crate::types::{BrandCrawlResult, CrawlResult, ManagedProduct, ProductItem};
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

/// 브랜드 페이지에서 전체 상품 수집 (무한 스크롤 처리)
pub fn crawl_brand_products(brand_id: &str) -> Result<BrandCrawlResult> {
    println!("[Crawler] Starting brand crawl for brand_id: {}", brand_id);
    let url = format!("https://gift.kakao.com/brand/{}", brand_id);

    println!("[Crawler] Launching Headless Chrome for brand page...");
    let browser = Browser::new(LaunchOptions {
        headless: true,
        args: vec![OsStr::new("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")],
        ..Default::default()
    })?;

    let tab = browser.new_tab()?;
    println!("[Crawler] Navigating to brand page: {}", url);
    tab.navigate_to(&url)?;

    // 상품 리스트 로딩 대기 (ul.list_prd 사용)
    println!("[Crawler] Waiting for brand product list...");
    let _ = tab.wait_for_element("ul.list_prd li");
    
    // 무한 스크롤 처리 - 더 이상 새 상품이 로드되지 않을 때까지 반복
    println!("[Crawler] Starting infinite scroll...");
    let mut last_count = 0;
    let mut stable_count = 0;
    
    for i in 0..50 {  // 최대 50회 스크롤 (안전장치)
        tab.evaluate("window.scrollTo(0, document.body.scrollHeight)", false)?;
        sleep(Duration::from_millis(800));
        
        let count_res = tab.evaluate("document.querySelectorAll('ul.list_prd > li').length", true);
        if let Ok(val) = count_res {
            if let Some(cnt) = val.value.and_then(|v| v.as_i64()) {
                println!("[Crawler] Scroll #{}: Found {} items", i + 1, cnt);
                
                if cnt as usize == last_count {
                    stable_count += 1;
                    if stable_count >= 3 {  // 3회 연속 동일하면 종료
                        println!("[Crawler] No more items loading. Stopping scroll.");
                        break;
                    }
                } else {
                    stable_count = 0;
                    last_count = cnt as usize;
                }
            }
        }
    }

    println!("[Crawler] Scroll complete. Extracting brand products...");

    // 브랜드 페이지 상품 추출 (실제 HTML 구조에 맞게)
    let js_script = format!(r#"
    (function() {{
        var items = [];
        var lis = document.querySelectorAll("ul.list_prd > li");
        
        for (var i = 0; i < lis.length; i++) {{
            var li = lis[i];
            
            // product_id: a.link_thumb의 href에서 추출 (/product/3722267 -> 3722267)
            var linkEl = li.querySelector("a.link_thumb");
            var product_id = "unknown";
            if (linkEl) {{
                var href = linkEl.getAttribute("href") || "";
                var match = href.match(/\/product\/(\d+)/);
                if (match) {{
                    product_id = match[1];
                }}
            }}
            
            // 상품명: .txt_prdname
            var nameEl = li.querySelector(".txt_prdname");
            var product_name = nameEl ? nameEl.textContent.trim() : "";
            
            // 이미지: img.img_thumb
            var imgEl = li.querySelector("img.img_thumb");
            var product_image_url = imgEl ? imgEl.getAttribute("src") : null;
            
            // 가격 (참고용, DB에 저장하지 않음)
            var priceEl = li.querySelector(".num_price");
            
            // 유효한 상품만 추가
            if (product_id !== "unknown" && product_name) {{
                items.push({{
                    product_id: product_id,
                    product_name: product_name,
                    product_image_url: product_image_url,
                    brand_id: "{}",
                    brand_name: "",
                    is_active: true,
                    last_updated_at: null
                }});
            }}
        }}
        return JSON.stringify(items);
    }})()
    "#, brand_id);

    let remote_object = tab.evaluate(&js_script, true)?;
    
    if remote_object.value.is_none() {
        println!("[Crawler] Error: Brand page JS returned no value");
        return Err(anyhow::anyhow!("JS execution returned undefined"));
    }
    
    let value = remote_object.value.unwrap();
    let json_str = value.as_str().ok_or(anyhow::anyhow!("JS returned non-string value"))?;
    
    println!("[Crawler] Parsing brand products JSON...");
    let items: Vec<ManagedProduct> = serde_json::from_str(json_str)?;
    println!("[Crawler] Extracted {} brand products.", items.len());

    Ok(BrandCrawlResult {
        brand_id: brand_id.to_string(),
        items,
    })
}

