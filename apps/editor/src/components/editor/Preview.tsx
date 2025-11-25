"use client";

import { useMemo, useState, useEffect } from "react";
import { compileMDX } from "@/lib/mdx";

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  const [compiledContent, setCompiledContent] =
    useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced content compilation
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!content.trim()) {
        setCompiledContent(null);
        setError(null);
        return;
      }

      try {
        const result = await compileMDX(content);
        setCompiledContent(result);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "MDX 컴파일 오류");
        setCompiledContent(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [content]);

  const placeholder = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center h-full text-muted">
        <svg
          className="w-16 h-16 mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">마크다운을 입력하면 프리뷰가 표시됩니다</p>
      </div>
    ),
    [],
  );

  if (!content.trim()) {
    return placeholder;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <h3 className="text-red-400 font-semibold mb-2">컴파일 오류</h3>
          <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  return <div className="p-6 prose-editor">{compiledContent}</div>;
}
