"use client";

import {
  Button,
  Check,
  LinkIcon,
  Linkedin,
  Twitter,
  Facebook,
} from "@hyoungmin/ui";
import { useMemo, useState } from "react";

type ShareButtonProps = {
  url?: string;
  title?: string;
  description?: string;
};

const ShareButton = ({ url, title, description }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  // url prop이 있으면 서버에서도 사용 가능, 없으면 클라이언트에서만 계산
  const currentUrl = useMemo(() => {
    // url prop이 있으면 서버/클라이언트 모두에서 사용 가능
    if (url) return url;
    // url prop이 없으면 클라이언트에서만 window.location 사용
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, [url]);

  const shareTitle =
    title || (typeof document !== "undefined" ? document.title : "");
  const shareText = description || shareTitle;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback: 텍스트 영역 사용
      if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const shareToSocial = (platform: string) => {
    if (!currentUrl || typeof window === "undefined") return;

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  if (!currentUrl) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* 링크 복사 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={copied ? "Link copied" : "Copy link"}
        onClick={handleCopyLink}
        className="text-primary-800"
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? (
          <Check className="h-6 w-6 text-primary-500" />
        ) : (
          <LinkIcon className="h-6 w-6" />
        )}
      </Button>

      {/* LinkedIn 공유 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Share on LinkedIn"
        onClick={() => shareToSocial("linkedin")}
        className="text-primary-800"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-6 w-6" />
      </Button>

      {/* Twitter/X 공유 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Share on Twitter / X"
        onClick={() => shareToSocial("twitter")}
        className="text-primary-800"
        title="Share on Twitter / X"
      >
        <Twitter className="h-6 w-6" />
      </Button>

      {/* Facebook 공유 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Share on Facebook"
        onClick={() => shareToSocial("facebook")}
        className="text-primary-800"
        title="Share on Facebook"
      >
        <Facebook className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ShareButton;
