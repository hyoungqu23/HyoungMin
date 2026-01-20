use rust_xlsxwriter::{Format, Workbook};

/// 최근 1개월 랭킹 데이터를 엑셀로 내보내기
#[tauri::command]
pub async fn export_rankings_excel(
    db: tauri::State<'_, crate::AppState>,
    file_path: String,
) -> Result<usize, String> {
    println!("[Export] Exporting rankings to: {}", file_path);
    
    // DB에서 데이터 조회
    let rankings = db.db.get_rankings_for_export().await.map_err(|e| e.to_string())?;
    
    // Excel Workbook 생성
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();

    // 헤더 스타일
    let header_format = Format::new().set_bold();

    // 헤더 쓰기
    worksheet.write_with_format(0, 0, "수집일시", &header_format).map_err(|e| e.to_string())?;
    worksheet.write_with_format(0, 1, "순위", &header_format).map_err(|e| e.to_string())?;
    worksheet.write_with_format(0, 2, "브랜드", &header_format).map_err(|e| e.to_string())?;
    worksheet.write_with_format(0, 3, "상품명", &header_format).map_err(|e| e.to_string())?;
    worksheet.write_with_format(0, 4, "가격", &header_format).map_err(|e| e.to_string())?;
    worksheet.write_with_format(0, 5, "상품ID", &header_format).map_err(|e| e.to_string())?;

    // 데이터 쓰기
    for (row_idx, item) in rankings.iter().enumerate() {
        let row = (row_idx + 1) as u32;
        worksheet.write_string(row, 0, &item.created_at).map_err(|e| e.to_string())?;
        worksheet.write_number(row, 1, item.rank as f64).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 2, &item.brand_name).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 3, &item.product_name).map_err(|e| e.to_string())?;
        worksheet.write_number(row, 4, item.price as f64).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 5, &item.product_id).map_err(|e| e.to_string())?;
    }

    // 컬럼 너비 자동 조정
    worksheet.set_column_width(0, 18).map_err(|e| e.to_string())?;
    worksheet.set_column_width(2, 15).map_err(|e| e.to_string())?;
    worksheet.set_column_width(3, 40).map_err(|e| e.to_string())?;

    workbook.save(&file_path).map_err(|e| e.to_string())?;
    
    println!("[Export] Rankings exported: {} rows", rankings.len());
    Ok(rankings.len())
}

/// 최근 1개월 리뷰 데이터를 엑셀로 내보내기
#[tauri::command]
pub async fn export_reviews_excel(
    db: tauri::State<'_, crate::AppState>,
    file_path: String,
) -> Result<usize, String> {
    println!("[Export] Exporting reviews to: {}", file_path);
    
    // DB에서 데이터 조회
    let reviews = db.db.get_reviews_for_export().await.map_err(|e| e.to_string())?;
    
    // Excel Workbook 생성
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();

    // 헤더 스타일
    let header_format = Format::new().set_bold();

    // 헤더 쓰기
    let headers = ["리뷰작성일", "수집일시", "상품명", "작성자", "평점", "내용", "이미지URL"];
    for (i, h) in headers.iter().enumerate() {
        worksheet.write_with_format(0, i as u16, *h, &header_format).map_err(|e| e.to_string())?;
    }

    // 데이터 쓰기
    for (row_idx, item) in reviews.iter().enumerate() {
        let row = (row_idx + 1) as u32;
        worksheet.write_string(row, 0, &item.review_date).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 1, &item.crawled_at).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 2, &item.product_name).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 3, &item.writer_name).map_err(|e| e.to_string())?;
        worksheet.write_number(row, 4, item.rating as f64).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 5, &item.content).map_err(|e| e.to_string())?;
        worksheet.write_string(row, 6, &item.images_json).map_err(|e| e.to_string())?;
    }

    // 컬럼 너비 자동 조정
    worksheet.set_column_width(0, 12).map_err(|e| e.to_string())?;
    worksheet.set_column_width(1, 18).map_err(|e| e.to_string())?;
    worksheet.set_column_width(2, 30).map_err(|e| e.to_string())?;
    worksheet.set_column_width(5, 50).map_err(|e| e.to_string())?;

    workbook.save(&file_path).map_err(|e| e.to_string())?;
    
    println!("[Export] Reviews exported: {} rows", reviews.len());
    Ok(reviews.len())
}
