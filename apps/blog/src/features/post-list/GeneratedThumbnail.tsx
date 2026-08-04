"use client";

import {
  generateThumbnailColor,
  getTextColor,
} from "@/shared/lib/generate-thumbnail-color";

interface GeneratedThumbnailProps {
  title: string;
  className?: string;
  bgColor?: string;
  compact?: boolean;
}

export const GeneratedThumbnail = ({
  title,
  className,
  bgColor: bgColorOverride,
  compact = false,
}: GeneratedThumbnailProps) => {
  const bgColor = bgColorOverride?.match(/^#?([0-9a-f]{6})$/i)?.[1]
    ? bgColorOverride.startsWith("#")
      ? bgColorOverride
      : `#${bgColorOverride}`
    : generateThumbnailColor(title);
  const textColor = getTextColor(bgColor);

  return (
    <div
      className={`${className || ""} flex items-center justify-center`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: compact ? "1rem" : "2rem",
      }}
    >
      <div
        className="text-center line-clamp-3 uppercase"
        style={{
          fontSize: compact ? "0.625rem" : "1.5rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {title}
      </div>
    </div>
  );
};
