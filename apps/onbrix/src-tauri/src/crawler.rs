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

/// 상품 리뷰 크롤링 (어제 날짜 리뷰만 수집)
pub fn crawl_reviews(product_id: &str, target_date: &str) -> Result<Vec<crate::types::ReviewItem>> {
    println!("[Crawler] Starting review crawl for product_id: {}, target_date: {}", product_id, target_date);
    
    // 리뷰 탭 URL (최신순 정렬)
    let url = format!(
        "https://gift.kakao.com/product/{}?tab=review&sortProperty=LATEST",
        product_id
    );

    println!("[Crawler] Launching Headless Chrome for review page...");
    let browser = Browser::new(LaunchOptions {
        headless: true,
        args: vec![OsStr::new("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")],
        ..Default::default()
    })?;

    let tab = browser.new_tab()?;
    println!("[Crawler] Navigating to review page: {}", url);
    tab.navigate_to(&url)?;

    // 리뷰 리스트 로딩 대기
    println!("[Crawler] Waiting for review list...");
    let _ = tab.wait_for_element("ul.list_review");
    sleep(Duration::from_millis(1000));

    // 무한 스크롤 처리 - 타겟 날짜 이전 데이터가 나올 때까지 스크롤
    println!("[Crawler] Starting scroll to load reviews...");
    let mut scroll_count = 0;
    let max_scrolls = 30;

    loop {
        if scroll_count >= max_scrolls {
            println!("[Crawler] Max scroll limit reached");
            break;
        }

        tab.evaluate("window.scrollTo(0, document.body.scrollHeight)", false)?;
        sleep(Duration::from_millis(800));
        scroll_count += 1;

        // 현재 로드된 리뷰 중 가장 오래된 날짜 확인
        let check_js = format!(r#"
        (function() {{
            var items = document.querySelectorAll('ul.list_review > app-view-review-item');
            if (items.length === 0) return "CONTINUE";
            var lastItem = items[items.length - 1];
            var dateEl = lastItem.querySelector('.list_reviewinfo li:nth-child(2) .txt_reviewinfo');
            if (!dateEl) return "CONTINUE";
            var dateStr = dateEl.innerText.trim(); // "2026.01.19" 형식
            var targetDate = "{}";
            // 날짜 비교: dateStr < targetDate 이면 STOP
            if (dateStr < targetDate) return "STOP";
            return "CONTINUE";
        }})()
        "#, target_date.replace("-", "."));

        let result = tab.evaluate(&check_js, true)?;
        if let Some(val) = result.value.and_then(|v| v.as_str().map(String::from)) {
            println!("[Crawler] Scroll #{}: status = {}", scroll_count, val);
            if val == "STOP" {
                break;
            }
        }
    }

    println!("[Crawler] Scroll complete. Extracting reviews...");

    // 리뷰 데이터 추출 (타겟 날짜만 필터링)
    let extract_js = format!(r#"
    (function() {{
        var targetDate = "{}";
        var items = [];
        var reviewEls = document.querySelectorAll('ul.list_review > app-view-review-item');
        
        for (var i = 0; i < reviewEls.length; i++) {{
            var el = reviewEls[i];
            
            // 날짜 파싱
            var dateEl = el.querySelector('.list_reviewinfo li:nth-child(2) .txt_reviewinfo');
            var dateStr = dateEl ? dateEl.innerText.trim() : "";
            // 형식 통일: "2026.01.19" -> "2026-01-19"
            var formattedDate = dateStr.replace(/\./g, "-");
            
            // 타겟 날짜가 아니면 스킵
            if (formattedDate !== targetDate) continue;
            
            // 작성자
            var nickEl = el.querySelector('.txt_nick');
            var writerName = nickEl ? nickEl.innerText.trim() : "익명";
            
            // 별점 (star_score4 -> 4)
            var scoreEl = el.querySelector('.area_score');
            var rating = 0;
            if (scoreEl) {{
                var match = scoreEl.className.match(/star_score(\d+)/);
                if (match) rating = parseInt(match[1]);
            }}
            
            // 리뷰 내용
            var contentEl = el.querySelector('.txt_review');
            var content = contentEl ? contentEl.innerText.trim() : "";
            
            // 이미지 URL 추출
            var images = [];
            var photoEls = el.querySelectorAll('.box_reviewphoto');
            for (var j = 0; j < photoEls.length; j++) {{
                var style = photoEls[j].getAttribute('style');
                if (style) {{
                    var urlMatch = style.match(/url\("?([^"')]+)"?\)/);
                    if (urlMatch) images.push(urlMatch[1]);
                }}
            }}
            
            items.push({{
                review_date: formattedDate,
                writer_name: writerName,
                rating: rating,
                content: content,
                images: images
            }});
        }}
        return JSON.stringify(items);
    }})()
    "#, target_date);

    let remote_object = tab.evaluate(&extract_js, true)?;
    
    if remote_object.value.is_none() {
        println!("[Crawler] Warning: No reviews found or JS returned undefined");
        return Ok(vec![]);
    }
    
    let value = remote_object.value.unwrap();
    let json_str = value.as_str().ok_or(anyhow::anyhow!("JS returned non-string value"))?;
    
    println!("[Crawler] Parsing review JSON...");
    let items: Vec<crate::types::ReviewItem> = serde_json::from_str(json_str)?;
    println!("[Crawler] Extracted {} reviews for date {}", items.len(), target_date);

    Ok(items)
}
