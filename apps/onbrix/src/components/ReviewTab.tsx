import { MessageSquare, Search, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ManagedProductWithRank,
  ReviewWithMeta,
  getAllReviews,
  getManagedProductsWithRank,
} from "../lib/commands";

export function ReviewTab() {
  const [reviews, setReviews] = useState<ReviewWithMeta[]>([]);
  const [products, setProducts] = useState<ManagedProductWithRank[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedProductDetails, setSelectedProductDetails] = useState<
    ManagedProductWithRank[]
  >([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  type SortKey = "latest" | "highest" | "lowest";
  const [sortKey, setSortKey] = useState<SortKey>("latest");

  useEffect(() => {
    loadData();
    window.addEventListener("refresh-data", loadData);
    return () => window.removeEventListener("refresh-data", loadData);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reviewsData, productsData] = await Promise.all([
        getAllReviews(), // Fetch all reviews
        getManagedProductsWithRank(),
      ]);
      setReviews(reviewsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load review data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get product name
  const getProductName = (pid: string) => {
    const p = products.find((p) => p.product_id === pid);
    return p ? p.product_name : pid;
  };

  // Filter Logic
  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    // Filter by selected products
    if (selectedProductDetails.length > 0) {
      const selectedIds = new Set(
        selectedProductDetails.map((p) => p.product_id),
      );
      filtered = filtered.filter((r) => selectedIds.has(r.product_id));
    }

    // Filter by keyword (content search)
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.content.toLowerCase().includes(keyword) ||
          r.writer_name.toLowerCase().includes(keyword),
      );
    }

    return filtered;
  }, [reviews, selectedProductDetails, searchKeyword]);

  // Sort Logic
  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      switch (sortKey) {
        case "highest":
          return b.rating - a.rating; // 내림차순
        case "lowest":
          return a.rating - b.rating; // 오름차순
        case "latest":
        default:
          // 날짜 내림차순 (문자열 비교로도 충분: YYYY-MM-DD)
          // 만약 날짜가 같다면 ID 역순 (최신 수집)
          if (b.review_date !== a.review_date) {
            return b.review_date.localeCompare(a.review_date);
          }
          return b.id - a.id;
      }
    });
  }, [filteredReviews, sortKey]);

  const toggleProductSelection = (product: ManagedProductWithRank) => {
    setSelectedProductDetails((prev) => {
      const exists = prev.find((p) => p.product_id === product.product_id);
      if (exists) {
        return prev.filter((p) => p.product_id !== product.product_id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            전체 리뷰 ({filteredReviews.length}개)
          </h2>

          <div className="flex gap-2 w-full md:w-auto">
            {/* Product Multi-Select Dropdown */}
            <div className="relative relative-dropdown w-64">
              <div
                className="w-full border rounded px-3 py-2 text-sm bg-white cursor-pointer flex justify-between items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="truncate">
                  {selectedProductDetails.length === 0
                    ? "모든 상품 보기"
                    : `${selectedProductDetails.length}개 상품 선택됨`}
                </span>
                <span className="text-xs">▼</span>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  <div
                    className="p-2 hover:bg-gray-50 cursor-pointer text-sm font-bold border-b"
                    onClick={() => setSelectedProductDetails([])}
                  >
                    전체 선택 해제
                  </div>
                  {products.map((p) => (
                    <div
                      key={p.product_id}
                      className={`p-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2 ${
                        selectedProductDetails.find(
                          (s) => s.product_id === p.product_id,
                        )
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() => toggleProductSelection(p)}
                    >
                      <input
                        type="checkbox"
                        checked={
                          !!selectedProductDetails.find(
                            (s) => s.product_id === p.product_id,
                          )
                        }
                        readOnly
                      />
                      <span className="truncate">{p.product_name}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Overlay to close dropdown */}
              {isDropdownOpen && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              className="px-3 py-2 border rounded-md text-sm bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="latest">최신순</option>
              <option value="highest">평점높은순</option>
              <option value="lowest">평점낮은순</option>
            </select>

            {/* Keyword Search */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="내용, 작성자 검색"
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Review List Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  작성일
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
                >
                  상품명
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                >
                  평점
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  내용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  작성자
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    리뷰 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                sortedReviews.map((review) => (
                  <tr
                    key={`${review.product_id}-${review.id}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.review_date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div
                        className="line-clamp-2"
                        title={getProductName(review.product_id)}
                      >
                        {getProductName(review.product_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-gray-700 font-medium">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="whitespace-pre-wrap line-clamp-3">
                        {review.content}
                      </div>
                      {review.images.length > 0 && (
                        <div className="mt-2 flex gap-1">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="review"
                              className="w-10 h-10 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.writer_name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
