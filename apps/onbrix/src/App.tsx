import { listen } from "@tauri-apps/api/event";
import {
  BarChart3,
  Loader2,
  Package,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HistoryChart } from "./components/HistoryChart";
import { ManagedProductList } from "./components/ManagedProductList";
import { RankingList } from "./components/RankingList";
import { ReviewAnalytics } from "./components/ReviewAnalytics";
import {
  getManagedProductsWithRank,
  ManagedProductWithRank,
  manualCrawl,
  ProductItem,
  searchBrandRankings,
  syncBrandProducts,
} from "./lib/commands";

// 하드코딩된 브랜드 ID
const BRAND_ID = "9839";

type TabType = "ranking" | "my-products";

interface SyncProgress {
  status: "idle" | "syncing" | "completed" | "error";
  message: string;
  count?: number;
}

function App() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>("ranking");

  // 랭킹 탭 상태
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [isCrawling, setIsCrawling] = useState(false);
  const keywordRef = useRef(keyword);

  // 내 상품 탭 상태
  const [managedProducts, setManagedProducts] = useState<
    ManagedProductWithRank[]
  >([]);
  const [selectedManagedProduct, setSelectedManagedProduct] =
    useState<ManagedProductWithRank | null>(null);
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({
    status: "idle",
    message: "",
  });

  // 랭킹 검색
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

  // 수동 랭킹 크롤
  const handleManualCrawl = async () => {
    if (isCrawling) return;
    setIsCrawling(true);
    try {
      await manualCrawl(4);
      alert("Crawl started/completed successfully!");
      handleSearch();
    } catch (err) {
      alert("Crawl failed: " + err);
    } finally {
      setIsCrawling(false);
    }
  };

  // 내 상품 로드
  const loadManagedProducts = async () => {
    try {
      const items = await getManagedProductsWithRank();
      console.log("[Frontend] Managed products:", items.length);
      setManagedProducts(items);
    } catch (err) {
      console.error("Failed to load managed products:", err);
    }
  };

  // 브랜드 동기화
  const handleBrandSync = async () => {
    if (syncProgress.status === "syncing") return;
    setSyncProgress({ status: "syncing", message: "동기화 준비 중..." });
    try {
      await syncBrandProducts(BRAND_ID);
      // 진행률 이벤트로 업데이트됨
    } catch (err) {
      setSyncProgress({
        status: "error",
        message: `동기화 실패: ${err}`,
      });
    }
  };

  // ManagedProduct를 ProductItem처럼 변환 (차트용)
  const managedToProductItem = (
    m: ManagedProductWithRank,
  ): ProductItem | null => {
    if (!m) return null;
    return {
      rank: m.current_rank ?? 0,
      product_id: m.product_id,
      product_name: m.product_name,
      brand_name: m.brand_name,
      price: 0,
      product_link: `https://gift.kakao.com/product/${m.product_id}`,
      img_thumb: m.product_image_url,
    };
  };

  // 앱 시작 시 데이터 로드
  useEffect(() => {
    handleSearch();
    loadManagedProducts();
  }, []);

  useEffect(() => {
    keywordRef.current = keyword;
  }, [keyword]);

  // 이벤트 리스너
  useEffect(() => {
    const unlistenRefresh = listen("refresh-needed", () => {
      console.log("Auto-refresh trigger");
      handleSearch();
      loadManagedProducts();
    });

    const unlistenSyncProgress = listen<SyncProgress>(
      "brand-sync-progress",
      (event) => {
        console.log("Brand sync progress:", event.payload);
        setSyncProgress(event.payload);
        if (event.payload.status === "completed") {
          loadManagedProducts();
        }
      },
    );

    return () => {
      unlistenRefresh.then((f) => f());
      unlistenSyncProgress.then((f) => f());
    };
  }, []);

  // 현재 선택된 상품 (탭에 따라)
  const currentSelectedProduct =
    activeTab === "ranking"
      ? selectedProduct
      : managedToProductItem(selectedManagedProduct!);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
            <span className="text-yellow-400 fill-current">
              <TrendingUp />
            </span>
            onbrix
          </h1>

          {/* 탭 네비게이션 */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
            <button
              onClick={() => setActiveTab("ranking")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "ranking"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              전체 랭킹
            </button>
            <button
              onClick={() => setActiveTab("my-products")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "my-products"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package className="w-4 h-4" />내 상품
            </button>
          </div>

          {/* 탭별 액션 바 */}
          {activeTab === "ranking" ? (
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
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleBrandSync}
                disabled={syncProgress.status === "syncing"}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  syncProgress.status === "syncing"
                    ? "bg-purple-100 text-purple-700 cursor-wait"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {syncProgress.status === "syncing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    동기화 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    브랜드 동기화
                  </>
                )}
              </button>

              {/* 프로그래스 표시 */}
              {syncProgress.status !== "idle" && (
                <div
                  className={`p-2 rounded-lg text-xs text-center ${
                    syncProgress.status === "syncing"
                      ? "bg-blue-50 text-blue-700"
                      : syncProgress.status === "completed"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {syncProgress.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "ranking" ? (
            <RankingList
              items={products}
              onSelect={setSelectedProduct}
              selectedId={selectedProduct?.product_id}
            />
          ) : (
            <ManagedProductList
              items={managedProducts}
              onSelect={setSelectedManagedProduct}
              selectedId={selectedManagedProduct?.product_id}
            />
          )}
        </div>
      </div>

      {/* Main: Chart & Details */}
      <div className="flex-1 flex flex-col bg-gray-50/50 p-6">
        {currentSelectedProduct ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <header className="mb-6 flex gap-4">
              {currentSelectedProduct.img_thumb && (
                <img
                  src={currentSelectedProduct.img_thumb}
                  alt="Product"
                  className="w-20 h-20 rounded-lg object-cover bg-gray-50"
                />
              )}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  {currentSelectedProduct.brand_name}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {currentSelectedProduct.product_name}
                </h2>
                <div className="mt-2 flex items-center gap-3">
                  {currentSelectedProduct.price > 0 && (
                    <span className="text-lg font-semibold text-gray-900">
                      {currentSelectedProduct.price.toLocaleString()}원
                    </span>
                  )}
                  {currentSelectedProduct.rank > 0 ? (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                      Current Rank: {currentSelectedProduct.rank}
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
                      순위 밖
                    </span>
                  )}
                  <a
                    href={currentSelectedProduct.product_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-blue-500 text-sm underline"
                  >
                    View Link
                  </a>
                </div>
              </div>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
              <HistoryChart productId={currentSelectedProduct.product_id} />

              {/* 내 상품 탭에서만 리뷰 분석 표시 */}
              {activeTab === "my-products" && selectedManagedProduct && (
                <ReviewAnalytics
                  productId={selectedManagedProduct.product_id}
                />
              )}
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
