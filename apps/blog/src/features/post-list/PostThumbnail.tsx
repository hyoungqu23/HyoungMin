"use client";

import type { PostMeta } from "@hyoungmin/schema";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { GeneratedThumbnail } from "./GeneratedThumbnail";

type PostThumbnailProps = {
  meta: PostMeta;
  firstImage?: string | null;
  seriesColor?: string;
  compact?: boolean;
};

const normalizeImageUrl = (url: string): string => {
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `/${url}`;
};

export const PostThumbnail = ({
  meta,
  firstImage,
  seriesColor,
  compact = false,
}: PostThumbnailProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const candidateImage = meta.cover
    ? normalizeImageUrl(meta.cover)
    : firstImage
      ? normalizeImageUrl(firstImage)
      : null;
  // 원격 MDX 이미지는 최적화 서버가 실패하면 깨진 아이콘만 남을 수 있다.
  // 목록에서는 로컬 에셋만 썸네일로 사용하고, 나머지는 결정론적 배경으로 대체한다.
  const thumbnailImage = candidateImage?.startsWith("/")
    ? candidateImage
    : null;

  useEffect(() => {
    if (!thumbnailImage) return;

    const checkImage = () => {
      const image = imageRef.current;
      if (image?.complete && image.naturalWidth === 0) setImageFailed(true);
    };

    const timeoutId = window.setTimeout(checkImage, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [thumbnailImage]);

  if (thumbnailImage && !imageFailed) {
    return (
      <Image
        src={thumbnailImage}
        alt={meta.title}
        fill
        ref={imageRef}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={compact ? "112px" : "(max-width: 768px) 100vw, 33vw"}
        unoptimized={thumbnailImage.startsWith("http")}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <GeneratedThumbnail
      title={meta.title}
      className="h-full w-full"
      bgColor={seriesColor}
      compact={compact}
    />
  );
};
