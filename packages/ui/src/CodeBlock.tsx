"use client";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";

export const CodeBlock = (props: ComponentProps<"pre">) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codeEl = preRef.current?.querySelector("code");
    const text = codeEl?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="relative w-full my-6 group">
      <button
        type="button"
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={handleCopy}
        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition rounded px-2 py-1 text-lg bg-black/70 text-white hover:bg-black/80"
      >
        {copied ? "✅" : "📋"}
      </button>
      <pre ref={preRef} {...props} />
    </div>
  );
};
