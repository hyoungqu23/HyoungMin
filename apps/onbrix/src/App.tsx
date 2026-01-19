import { listen } from "@tauri-apps/api/event";
import { BarChart3, RefreshCw, Search, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HistoryChart } from "./components/HistoryChart";
import { RankingList } from "./components/RankingList";
import { manualCrawl, ProductItem, searchBrandRankings } from "./lib/commands";

function App() {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [isCrawling, setIsCrawling] = useState(false);
  const keywordRef = useRef(keyword);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const currentKeyword = keywordRef.current.trim();
      const items = await searchBrandRankings(currentKeyword);
      console.log("[Frontend] Search returned", items.length, "items");
      setProducts(items);
    } catch (err) {
      console.error(err);
      alert("Search failed: " + err);
    }
  };

  const handleManualCrawl = async () => {
    if (isCrawling) return;
    setIsCrawling(true);
    try {
      await manualCrawl(4); // Default category
      alert("Crawl started/completed successfully!");
      handleSearch(); // Reload data after crawl
    } catch (err) {
      alert("Crawl failed: " + err);
    } finally {
      setIsCrawling(false);
    }
  };

  // Load initial data on app start
  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    keywordRef.current = keyword;
  }, [keyword]);

  useEffect(() => {
    const unlisten = listen("refresh-needed", () => {
      console.log("Auto-refresh trigger");
      handleSearch();
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar: Search & List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
            <span className="text-yellow-400 fill-current">
              <TrendingUp />
            </span>
            onbrix
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  const nextKeyword = e.target.value;
                  keywordRef.current = nextKeyword;
                  setKeyword(nextKeyword);
                }}
                placeholder="Brand name..."
                className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              type="button"
              onClick={handleManualCrawl}
              disabled={isCrawling}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${
                isCrawling ? "animate-spin" : ""
              }`}
              title="Update Now"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto">
          <RankingList
            items={products}
            onSelect={setSelectedProduct}
            selectedId={selectedProduct?.product_id}
          />
        </div>
      </div>

      {/* Main: Chart & Details */}
      <div className="flex-1 flex flex-col bg-gray-50/50 p-6">
        {selectedProduct ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <header className="mb-6 flex gap-4">
              {selectedProduct.img_thumb && (
                <img
                  src={selectedProduct.img_thumb}
                  alt="Product"
                  className="w-20 h-20 rounded-lg object-cover bg-gray-50"
                />
              )}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  {selectedProduct.brand_name}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {selectedProduct.product_name}
                </h2>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedProduct.price.toLocaleString()}원
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                    Current Rank: {selectedProduct.rank}
                  </span>
                  <a
                    href={selectedProduct.product_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-blue-500 text-sm underline"
                  >
                    View Link
                  </a>
                </div>
              </div>
            </header>

            <div className="flex-1 min-h-0">
              <HistoryChart productId={selectedProduct.product_id} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a product to view history</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
