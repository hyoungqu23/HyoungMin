"use client";

import { useState, useCallback } from "react";
import { MetadataForm } from "@/components/editor/MetadataForm";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { Preview } from "@/components/editor/Preview";
import { Toolbar } from "@/components/editor/Toolbar";
import type { PostMeta } from "@hyoungmin/schema";

type ViewMode = "split" | "editor" | "preview";

const defaultMetadata: PostMeta = {
  title: "",
  description: "",
  createdAt: new Date(),
  tags: [],
  draft: true,
};

export default function EditorPage() {
  const [metadata, setMetadata] = useState<PostMeta>(defaultMetadata);
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localImages, setLocalImages] = useState<Map<string, string>>(
    new Map(),
  );

  const handleImageInsert = useCallback(
    (imagePath: string, localPath: string) => {
      setLocalImages((prev) => new Map(prev).set(imagePath, localPath));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Import Tauri APIs dynamically (only available in Tauri context)
      const { invoke } = await import("@tauri-apps/api/core");

      await invoke("submit_post", {
        metadata: {
          ...metadata,
          createdAt: metadata.createdAt.toISOString().split("T")[0],
        },
        content,
        localImages: Object.fromEntries(localImages),
      });

      alert("포스트가 성공적으로 제출되었습니다!");
    } catch (error) {
      console.error("Submit error:", error);
      alert(`제출 실패: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [metadata, content, localImages]);

  const handleSaveDraft = useCallback(async () => {
    try {
      const { invoke } = await import("@tauri-apps/api/core");

      await invoke("save_draft", {
        metadata: {
          ...metadata,
          createdAt: metadata.createdAt.toISOString().split("T")[0],
        },
        content,
      });

      alert("임시 저장되었습니다!");
    } catch (error) {
      console.error("Save draft error:", error);
      alert(`저장 실패: ${error}`);
    }
  }, [metadata, content]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-none border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Blog Editor</h1>
          <Toolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onSave={handleSaveDraft}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isValid={!!metadata.title && !!metadata.description && !!content}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Metadata Form */}
        <aside className="w-80 flex-none border-r border-border overflow-y-auto p-4">
          <MetadataForm metadata={metadata} onChange={setMetadata} />
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex overflow-hidden">
          {(viewMode === "split" || viewMode === "editor") && (
            <div className={viewMode === "split" ? "w-1/2" : "w-full"}>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                onImageInsert={handleImageInsert}
              />
            </div>
          )}

          {(viewMode === "split" || viewMode === "preview") && (
            <div
              className={`${
                viewMode === "split" ? "w-1/2 border-l border-border" : "w-full"
              } overflow-y-auto`}
            >
              <Preview content={content} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
