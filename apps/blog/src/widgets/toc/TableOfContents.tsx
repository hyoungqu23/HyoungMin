'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type TocItem = {
  id: string;
  text: string;
  level: number;
};

const TableOfContents = () => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 헤딩 요소 추출 (h2, h3)
    const headingElements = Array.from(
      document.querySelectorAll<HTMLHeadingElement>('main h2, main h3'),
    );

    const tocItems: TocItem[] = headingElements.map((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1), 10), // h2 -> 2, h3 -> 3
      };
    });

    setHeadings(tocItems);

    // 헤딩이 없으면 TOC 숨김
    if (tocItems.length === 0) {
      return;
    }

    // 스크롤 위치에 따라 활성 항목 업데이트
    const updateActiveId = () => {
      const scrollPosition = window.scrollY + 100; // 헤더 높이 + 여유 공간

      // 현재 뷰포트에 있는 헤딩 찾기
      let currentId = '';
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        if (!item) continue;
        
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentId = item.id;
          break;
        }
      }

      // 첫 번째 헤딩보다 위에 있으면 첫 번째 헤딩 활성화
      if (!currentId && tocItems.length > 0) {
        const firstItem = tocItems[0];
        if (firstItem) {
          const firstElement = document.getElementById(firstItem.id);
          if (firstElement && firstElement.offsetTop > scrollPosition) {
            currentId = firstItem.id;
          }
        }
      }

      setActiveId(currentId);
    };

    // 초기 활성 항목 설정
    updateActiveId();

    // 스크롤 이벤트 리스너 등록 (throttle 적용)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveId();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveId, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveId);
    };
  }, []);

  // 헤딩이 없으면 TOC 숨김
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label='Table of contents'
      className='hidden lg:block lg:w-64 lg:flex-shrink-0'
    >
      <div className='sticky top-20 space-y-2'>
        <h2 className='text-sm font-semibold text-gray-900 dark:text-white mb-4'>
          목차
        </h2>
        <ul className='space-y-1 text-sm'>
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const indentClass =
              heading.level === 3 ? 'ml-4' : 'ml-0';

            return (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={`block py-1 px-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  } ${indentClass}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.id);
                    if (element) {
                      const headerHeight = 64; // 헤더 높이
                      const offset = element.offsetTop - headerHeight - 16; // 여유 공간
                      window.scrollTo({
                        top: offset,
                        behavior: 'smooth',
                      });
                      // URL 업데이트 (스크롤 후)
                      setTimeout(() => {
                        window.history.pushState(null, '', `#${heading.id}`);
                      }, 100);
                    }
                  }}
                >
                  {heading.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;

