'use client';
import { useRef, useState } from 'react';
// TODO: shadcn Button 컴포넌트 설정 후 import
// import { Button } from '@/components/ui/button';

export const CodeBlock = (props: any) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codeEl = preRef.current?.querySelector('code');
    const text = codeEl?.innerText ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className='relative my-6 group'>
      <pre ref={preRef} {...props} />
      <button
        type='button'
        aria-label='Copy code'
        onClick={handleCopy}
        className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition rounded px-2 py-1 text-sm bg-black/70 text-white'
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
