"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import type { PostMeta } from "@hyoungmin/schema";

interface MetadataFormProps {
  metadata: PostMeta;
  onChange: (metadata: PostMeta) => void;
}

export function MetadataForm({ metadata, onChange }: MetadataFormProps) {
  const [tagInput, setTagInput] = useState("");

  const handleChange = useCallback(
    <K extends keyof PostMeta>(field: K, value: PostMeta[K]) => {
      onChange({ ...metadata, [field]: value });
    },
    [metadata, onChange],
  );

  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !metadata.tags.includes(tag)) {
      handleChange("tags", [...metadata.tags, tag]);
      setTagInput("");
    }
  }, [tagInput, metadata.tags, handleChange]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      handleChange(
        "tags",
        metadata.tags.filter((tag) => tag !== tagToRemove),
      );
    },
    [metadata.tags, handleChange],
  );

  const handleTagKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        handleAddTag();
      } else if (
        e.key === "Backspace" &&
        !tagInput &&
        metadata.tags.length > 0
      ) {
        handleRemoveTag(metadata.tags[metadata.tags.length - 1]);
      }
    },
    [handleAddTag, handleRemoveTag, tagInput, metadata.tags],
  );

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        메타데이터
      </h2>

      {/* Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground"
        >
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={metadata.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="포스트 제목을 입력하세요"
          className="w-full px-3 py-2 bg-border/30 border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          설명 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={metadata.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="포스트에 대한 간단한 설명"
          rows={3}
          className="w-full px-3 py-2 bg-border/30 border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
        />
      </div>

      {/* Created At */}
      <div className="space-y-1.5">
        <label
          htmlFor="createdAt"
          className="block text-sm font-medium text-foreground"
        >
          작성일
        </label>
        <input
          id="createdAt"
          type="date"
          value={metadata.createdAt.toISOString().split("T")[0]}
          onChange={(e) => handleChange("createdAt", new Date(e.target.value))}
          className="w-full px-3 py-2 bg-border/30 border border-border rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-foreground"
        >
          태그
        </label>
        <div className="tag-input">
          {metadata.tags.map((tag) => (
            <span key={tag} className="tag-item">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={handleAddTag}
            placeholder={metadata.tags.length === 0 ? "태그 입력 후 Enter" : ""}
            className="flex-1 min-w-[100px] bg-transparent text-foreground placeholder:text-muted focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-1.5">
        <label
          htmlFor="cover"
          className="block text-sm font-medium text-foreground"
        >
          커버 이미지 경로
        </label>
        <input
          id="cover"
          type="text"
          value={metadata.cover || ""}
          onChange={(e) => handleChange("cover", e.target.value || undefined)}
          placeholder="/images/posts/cover.webp"
          className="w-full px-3 py-2 bg-border/30 border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>

      {/* Draft Toggle */}
      <div className="flex items-center justify-between py-2">
        <label htmlFor="draft" className="text-sm font-medium text-foreground">
          초안으로 저장
        </label>
        <button
          id="draft"
          type="button"
          role="switch"
          aria-checked={metadata.draft}
          onClick={() => handleChange("draft", !metadata.draft)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            metadata.draft ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-foreground rounded-full transition-transform ${
              metadata.draft ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
