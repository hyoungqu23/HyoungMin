"use client";

type ViewMode = "split" | "editor" | "preview";

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSave: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function Toolbar({
  viewMode,
  onViewModeChange,
  onSave,
  onSubmit,
  isSubmitting,
  isValid,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* View Mode Toggle */}
      <div className="flex items-center bg-border/30 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange("editor")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            viewMode === "editor"
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
          title="에디터만 보기"
        >
          <EditorIcon />
        </button>
        <button
          onClick={() => onViewModeChange("split")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            viewMode === "split"
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
          title="분할 보기"
        >
          <SplitIcon />
        </button>
        <button
          onClick={() => onViewModeChange("preview")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            viewMode === "preview"
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
          title="프리뷰만 보기"
        >
          <PreviewIcon />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="px-4 py-1.5 text-sm font-medium text-foreground bg-border/50 hover:bg-border rounded-lg transition-colors"
        >
          임시 저장
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !isValid}
          className="px-4 py-1.5 text-sm font-medium text-white bg-accent hover:bg-accent/80 disabled:bg-accent/50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              제출 중...
            </>
          ) : (
            <>
              <UploadIcon />
              GitHub에 제출
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function EditorIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
      />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
