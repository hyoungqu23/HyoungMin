import { Calendar, Image, Loader2, MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getProductReviews,
  getReviewStats,
  manualReviewCrawl,
  ReviewStats,
  ReviewWithMeta,
} from "../lib/commands";

interface ReviewAnalyticsProps {
  productId: string;
}

export function ReviewAnalytics({ productId }: ReviewAnalyticsProps) {
  const [reviews, setReviews] = useState<ReviewWithMeta[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [activeView, setActiveView] = useState<"list" | "gallery">("list");

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      const [reviewsData, statsData] = await Promise.all([
        getProductReviews(productId, 50),
        getReviewStats(productId),
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load review data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  // 수동 크롤링
  const handleManualCrawl = async () => {
    if (crawling) return;
    setCrawling(true);
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const targetDate = yesterday.toISOString().split("T")[0];

      const count = await manualReviewCrawl(productId, targetDate);
      alert(`${count}개 리뷰가 수집되었습니다.`);
      loadData();
    } catch (err) {
      alert(`크롤링 실패: ${err}`);
    } finally {
      setCrawling(false);
    }
  };

  // 별점 렌더링
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  // 이미지만 추출
  const allImages = reviews.flatMap((r) =>
    r.images.map((img) => ({ img, review: r })),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          리뷰 분석
        </h3>
        <button
          onClick={handleManualCrawl}
          disabled={crawling}
          className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
        >
          {crawling ? "수집 중..." : "수동 수집"}
        </button>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total_count}
            </div>
            <div className="text-xs text-gray-500">전체 리뷰</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.average_rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">평균 평점</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {stats.yesterday_count}
            </div>
            <div className="text-xs text-gray-500">어제 리뷰</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-500">
              {stats.yesterday_avg_rating > 0
                ? stats.yesterday_avg_rating.toFixed(1)
                : "-"}
            </div>
            <div className="text-xs text-gray-500">어제 평점</div>
          </div>
        </div>
      )}

      {/* 뷰 토글 */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveView("list")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 ${
            activeView === "list"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="w-4 h-4" />
          목록
        </button>
        <button
          onClick={() => setActiveView("gallery")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 ${
            activeView === "gallery"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Image className="w-4 h-4" />
          갤러리 ({allImages.length})
        </button>
      </div>

      {/* 리뷰 리스트 */}
      {activeView === "list" && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              수집된 리뷰가 없습니다
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {review.writer_name}
                    </span>
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-xs text-gray-400">
                    {review.review_date}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {review.content}
                </p>
                {review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review ${idx + 1}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 갤러리 */}
      {activeView === "gallery" && (
        <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
          {allImages.length === 0 ? (
            <div className="col-span-4 text-center py-8 text-gray-400">
              이미지가 없습니다
            </div>
          ) : (
            allImages.map(({ img, review }, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-2">
                  <div className="text-white text-xs">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <div className="truncate">{review.writer_name}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
