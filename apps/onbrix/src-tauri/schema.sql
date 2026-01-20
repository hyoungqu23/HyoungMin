PRAGMA foreign_keys = ON;

-- Crawl Sessions (Snapshot)
CREATE TABLE IF NOT EXISTS crawl_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT (datetime('now', 'localtime')),
  status TEXT CHECK(status IN ('SUCCESS','FAILED')) NOT NULL DEFAULT 'SUCCESS',
  category_id INTEGER NOT NULL,
  source_url TEXT NOT NULL,
  total_items INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);

-- Ranking Items (Product)
CREATE TABLE IF NOT EXISTS ranking_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  rank INTEGER NOT NULL,              -- 1 ~ 100
  product_id TEXT NOT NULL,           -- DOM data-product-id
  product_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  product_link TEXT NOT NULL,
  img_thumb TEXT,
  FOREIGN KEY(session_id) REFERENCES crawl_sessions(id) ON DELETE CASCADE
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_items_product_id ON ranking_items(product_id);
CREATE INDEX IF NOT EXISTS idx_items_brand_name ON ranking_items(brand_name);
CREATE INDEX IF NOT EXISTS idx_items_session_brand ON ranking_items(session_id, brand_name);
CREATE INDEX IF NOT EXISTS idx_items_product_session ON ranking_items(product_id, session_id);

-- Prevent duplicates in same session
CREATE UNIQUE INDEX IF NOT EXISTS ux_session_product
ON ranking_items(session_id, product_id);

-- [신규] 관리 대상 상품 (자사 상품 마스터)
-- 매일 08시 혹은 앱 실행 시 업데이트 (Upsert)
CREATE TABLE IF NOT EXISTS managed_products (
  product_id TEXT PRIMARY KEY,           -- 고유 ID
  product_name TEXT NOT NULL,
  product_image_url TEXT,
  brand_id TEXT NOT NULL,                 -- 브랜드 ID
  brand_name TEXT,
  is_active BOOLEAN DEFAULT 1,            -- 품절/삭제 추적
  last_updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

-- Managed Products 인덱스
CREATE INDEX IF NOT EXISTS idx_managed_brand ON managed_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_managed_active ON managed_products(is_active);

-- [신규] 상품 리뷰 테이블 (VoC 수집)
CREATE TABLE IF NOT EXISTS product_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,           -- managed_products 테이블 참조
  review_date TEXT NOT NULL,          -- YYYY-MM-DD (작성일)
  writer_name TEXT NOT NULL,
  rating INTEGER NOT NULL,            -- 1 ~ 5
  content TEXT,
  images_json TEXT,                   -- 이미지 URL 배열 (JSON 문자열)
  crawled_at DATETIME DEFAULT (datetime('now', 'localtime')),
  
  -- 중복 수집 방지 (동일 제품, 동일 작성자, 동일 날짜, 동일 내용)
  UNIQUE(product_id, writer_name, review_date, content)
);

-- 리뷰 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_product_date ON product_reviews(product_id, review_date);
CREATE INDEX IF NOT EXISTS idx_reviews_crawled_at ON product_reviews(crawled_at);
