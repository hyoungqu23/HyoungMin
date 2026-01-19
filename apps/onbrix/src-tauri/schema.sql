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
