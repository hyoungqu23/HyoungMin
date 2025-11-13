'use client';
import { useRef, useState, useEffect } from 'react';
import type { ComponentProps } from 'react';
// TODO: shadcn Button 컴포넌트 설정 후 import
// import { Button } from '@/components/ui/button';

export const CodeBlock = (props: ComponentProps<'pre'>) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);

  useEffect(() => {
    if (!preRef.current) return;

    // data-title 또는 data-rehype-pretty-code-title 속성에서 파일명 추출
    const title =
      preRef.current.getAttribute('data-title') ||
      preRef.current.getAttribute('data-rehype-pretty-code-title');

    if (title) {
      setFilename(title);
      return;
    }

    // data-language에서 파일명 추출 (예: "tsx:app/page.tsx" -> "app/page.tsx")
    const language = preRef.current.getAttribute('data-language');
    if (language && language.includes(':')) {
      const parts = language.split(':');
      if (parts.length > 1) {
        setFilename(parts.slice(1).join(':'));
      }
    }

    // 부모 figure 요소에서 파일명 확인
    const figure = preRef.current.closest('figure[data-rehype-pretty-code-figure]');
    if (figure) {
      const figcaption = figure.querySelector('figcaption[data-rehype-pretty-code-title]');
      if (figcaption) {
        const captionText = figcaption.textContent;
        if (captionText) {
          setFilename(captionText);
        }
      }
      // figure의 data-title 속성 확인
      const figureTitle =
        figure.getAttribute('data-title') ||
        figure.getAttribute('data-rehype-pretty-code-title');
      if (figureTitle) {
        setFilename(figureTitle);
      }
    }
  }, [props]);

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
      {filename && (
        <div className='px-4 py-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg'>
          {filename}
        </div>
      )}
      <pre
        ref={preRef}
        {...props}
        className={filename ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'}
      />
      <button
        type='button'
        aria-label='Copy code'
        onClick={handleCopy}
        className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition rounded px-2 py-1 text-sm bg-black/70 text-white'
        style={{ top: filename ? '2.5rem' : '0.5rem' }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
