"use client";

import {
  Button,
  Check,
  Link,
  Facebook,
  Linkedin,
  Reddit,
  Threads,
  X,
  Chatgpt,
  Claude,
  Grok,
} from "@hyoungmin/ui";
import { useMemo, useState } from "react";

type ShareButtonProps = {
  url?: string;
  // title?: string;
  // description?: string;
};

const ShareButton = ({
  url,
  //  title,
  //   description
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  // url prop이 있으면 서버에서도 사용 가능, 없으면 클라이언트에서만 계산
  const currentUrl = useMemo(() => {
    // url prop이 있으면 서버/클라이언트 모두에서 사용 가능
    if (url) return url;
    // url prop이 없으면 클라이언트에서만 window.location 사용
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, [url]);

  const shareToSocial = (
    platform: "linkedin" | "facebook" | "x" | "reddit" | "threads",
  ) => {
    if (!currentUrl || typeof window === "undefined") return;

    const shareTitle = typeof document !== "undefined" ? document.title : "";

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}`;
        break;
      case "threads":
        shareUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(currentUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const askAiAboutContent = (provider: "chatgpt" | "claude" | "grok") => {
    if (!currentUrl || typeof window === "undefined") return;

    const prompt = `Read ${currentUrl} summarize and answer questions about the content`;

    let url = "";

    switch (provider) {
      case "chatgpt":
        url = `https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`;
        break;
      case "claude":
        url = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
        break;
      case "grok":
        url = `https://grok.com?q=${encodeURIComponent(prompt)}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    if (!currentUrl) return;

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
        title={copied ? "Copied!" : currentUrl ? "Copy link" : "링크 준비 중"}
        disabled={!currentUrl}
      >
        {copied ? (
          <Check className="h-6 w-6 text-primary-500" />
        ) : (
          <Link className="h-6 w-6" />
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
        disabled={!currentUrl}
      >
        <Linkedin className="h-6 w-6" />
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
        disabled={!currentUrl}
      >
        <Facebook className="h-6 w-6" />
      </Button>

      {/* X(Twitter) 공유 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Share on X (Twitter)"
        onClick={() => shareToSocial("x")}
        className="text-primary-800"
        title="Share on X (Twitter)"
        disabled={!currentUrl}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Reddit 공유 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Share on Reddit"
        onClick={() => shareToSocial("reddit")}
        className="text-primary-800"
        title="Share on Reddit"
        disabled={!currentUrl}
      >
        <Reddit className="h-6 w-6" />
      </Button>

      {/* Threads 공유 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Share on Threads"
        onClick={() => shareToSocial("threads")}
        className="text-primary-800"
        title="Share on Threads"
        disabled={!currentUrl}
      >
        <Threads className="h-6 w-6" />
      </Button>

      {/* ChatGPT 에게 이 글 요약/질문하기 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Ask ChatGPT about this content"
        onClick={() => askAiAboutContent("chatgpt")}
        className="text-primary-800"
        title="Ask ChatGPT about this content"
        disabled={!currentUrl}
      >
        <Chatgpt className="h-6 w-6" />
      </Button>

      {/* Claude 에게 이 글 요약/질문하기 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Ask Claude about this content"
        onClick={() => askAiAboutContent("claude")}
        className="text-primary-800"
        title="Ask Claude about this content"
        disabled={!currentUrl}
      >
        <Claude className="h-6 w-6" />
      </Button>

      {/* Grok 에게 이 글 요약/질문하기 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Ask Grok about this content"
        onClick={() => askAiAboutContent("grok")}
        className="text-primary-800"
        title="Ask Grok about this content"
        disabled={!currentUrl}
      >
        <Grok className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ShareButton;
