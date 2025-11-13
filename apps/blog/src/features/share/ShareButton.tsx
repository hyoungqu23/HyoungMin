'use client';

import { CheckIcon, LinkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

type ShareButtonProps = {
  url?: string;
  title?: string;
  description?: string;
};

const ShareButton = ({ url, title, description }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // useMemo로 클라이언트 사이드에서만 URL 계산 (useEffect 대신)
  const currentUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return url || window.location.href;
  }, [url]);

  const shareTitle = title || (typeof document !== 'undefined' ? document.title : '');
  const shareText = description || shareTitle;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback: 텍스트 영역 사용
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkedInShare = () => {
    if (!currentUrl || typeof window === 'undefined') return;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  if (!currentUrl) {
    return null;
  }

  return (
    <div className='flex items-center gap-2'>
      {/* 링크 복사 버튼 */}
      <button
        type='button'
        aria-label={copied ? 'Link copied' : 'Copy link'}
        onClick={handleCopyLink}
        className='p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <CheckIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
        ) : (
          <LinkIcon className='h-6 w-6' />
        )}
      </button>

      {/* LinkedIn 공유 버튼 */}
      <button
        type='button'
        aria-label='Share on LinkedIn'
        onClick={handleLinkedInShare}
        className='p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
        title='Share on LinkedIn'
      >
        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
          <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
        </svg>
      </button>
    </div>
  );
};

export default ShareButton;
