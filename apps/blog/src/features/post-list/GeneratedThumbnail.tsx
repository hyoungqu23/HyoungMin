"use client";

import {
  generateThumbnailColor,
  getTextColor,
} from "@/shared/lib/generate-thumbnail-color";

interface GeneratedThumbnailProps {
  title: string;
  className?: string;
  bgColor?: string;
}

export const GeneratedThumbnail = ({
  title,
  className,
  bgColor: bgColorOverride,
}: GeneratedThumbnailProps) => {
  const bgColor = bgColorOverride ?? generateThumbnailColor(title);
  const textColor = getTextColor(bgColor);

  return (
    <div
      className={`${className || ""} flex items-center justify-center`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "2rem",
      }}
    >
      <div
        className="text-center line-clamp-3"
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          lineHeight: "1.4",
          wordBreak: "break-word",
        }}
      >
        {title}
      </div>
    </div>
  );
};
