"use client";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { Check, Copy } from "./icons";

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
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity rounded p-2 bg-black/70 text-white hover:bg-black/80"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre ref={preRef} className="p-4 rounded-xl box-shadow-lg" {...props} />
    </div>
  );
};
