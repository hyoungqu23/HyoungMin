import { Package, Trophy } from "lucide-react";
import { ManagedProductWithRank } from "../lib/commands";

interface ManagedProductListProps {
  items: ManagedProductWithRank[];
  onSelect: (item: ManagedProductWithRank) => void;
  selectedId?: string;
}

export function ManagedProductList({
  items,
  onSelect,
  selectedId,
}: ManagedProductListProps) {
  // 진입률 계산
  const totalCount = items.length;
  const rankedCount = items.filter((item) => item.current_rank != null).length;
  const hitRate =
    totalCount > 0 ? ((rankedCount / totalCount) * 100).toFixed(1) : "0";

  // 랭킹 변화 렌더링
  const renderRankChange = (current?: number, prev?: number) => {
    if (current == null) {
      // 현재 순위권 밖인데 이전에 순위권이었다면 OUT 표시도 가능하나,
      // 일단은 '순위 밖' 배지만 표시되는 것으로 유지
      return null;
    }

    // 이전에 순위권 밖이었거나 기록이 없는 경우
    if (prev == null) {
      return <span className="text-xs text-red-500 font-bold ml-1">New</span>;
    }

    const diff = prev - current;
    if (diff > 0) {
      return (
        <span className="text-xs text-red-500 font-bold ml-1">▲{diff}</span>
      );
    } else if (diff < 0) {
      return (
        <span className="text-xs text-blue-500 font-bold ml-1">
          ▼{Math.abs(diff)}
        </span>
      );
    } else {
      return <span className="text-xs text-gray-400 font-bold ml-1">-</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 진입률 요약 카드 */}
      {totalCount > 0 && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-purple-600 font-medium">
                랭킹 진입률
              </div>
              <div className="text-lg font-bold text-purple-900">
                {rankedCount} / {totalCount}개 ({hitRate}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상품 리스트 */}
      <ul className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <li className="p-8 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>등록된 상품이 없습니다</p>
            <p className="text-sm mt-1">브랜드 동기화를 먼저 실행해주세요</p>
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.product_id}
              onClick={() => onSelect(item)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50 ${
                selectedId === item.product_id
                  ? "bg-yellow-50 border-l-4 border-l-yellow-400"
                  : ""
              }`}
            >
              {/* 썸네일 */}
              {item.product_image_url ? (
                <img
                  src={item.product_image_url}
                  alt={item.product_name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-gray-300" />
                </div>
              )}

              {/* 상품 정보 */}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 truncate">
                  {item.brand_name}
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {item.product_name}
                </div>
              </div>

              {/* 랭킹 배지 (우측 정렬용 ml-auto 추가 고려 가능) */}
              <div className="flex flex-col items-end flex-shrink-0 min-w-[60px]">
                {item.current_rank != null ? (
                  <div className="flex items-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                      #{item.current_rank}
                    </span>
                    {/* 변동 내역 표시 */}
                    {renderRankChange(item.current_rank, item.previous_rank)}
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                    순위 밖
                  </span>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
