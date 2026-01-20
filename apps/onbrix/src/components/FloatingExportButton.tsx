import { invoke } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  MessageSquareQuote,
} from "lucide-react";
import { useState } from "react";

export function FloatingExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (type: "rankings" | "reviews") => {
    try {
      setIsExporting(true);
      setIsOpen(false);

      // 1. 파일 저장 경로 선택 다이얼로그 열기
      const defaultName =
        type === "rankings"
          ? `Onbrix_Rankings_${new Date().toISOString().slice(0, 10)}.xlsx`
          : `Onbrix_Reviews_${new Date().toISOString().slice(0, 10)}.xlsx`;

      const filePath = await save({
        defaultPath: defaultName,
        filters: [
          {
            name: "Excel Files",
            extensions: ["xlsx"],
          },
        ],
      });

      if (!filePath) {
        setIsExporting(false);
        return; // 사용자가 취소함
      }

      // 2. Rust로 경로 전달하여 엑셀 생성 요청
      const command =
        type === "rankings" ? "export_rankings_excel" : "export_reviews_excel";
      const count = await invoke<number>(command, { filePath });

      alert(`성공적으로 저장되었습니다! (${count}개 행)`);
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다: " + e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-4 space-y-3 flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* 옵션 1: 랭킹 다운로드 */}
          <button
            onClick={() => handleExport("rankings")}
            disabled={isExporting}
            className="flex items-center gap-3 bg-white text-gray-800 px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 hover:bg-green-50 transition hover:text-green-700 font-medium whitespace-nowrap"
          >
            <span className="text-sm">최근 1개월 랭킹</span>
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <FileSpreadsheet size={18} />
            </div>
          </button>

          {/* 옵션 2: 리뷰 다운로드 */}
          <button
            onClick={() => handleExport("reviews")}
            disabled={isExporting}
            className="flex items-center gap-3 bg-white text-gray-800 px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 hover:bg-blue-50 transition hover:text-blue-700 font-medium whitespace-nowrap"
          >
            <span className="text-sm">최근 1개월 리뷰</span>
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <MessageSquareQuote size={18} />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={`bg-gray-900 text-white p-4 rounded-full shadow-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        {isExporting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Download size={24} />
        )}
      </button>
    </div>
  );
}
