import type { TocItem } from '@/shared/lib/rehype-extract-headings';
import Link from 'next/link';

type TableOfContentsProps = {
  headings: TocItem[];
};

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  // 헤딩이 없으면 TOC 숨김
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label='Table of contents' className='hidden lg:block lg:w-64 lg:shrink-0'>
      <div className='sticky top-20 space-y-2'>
        <h2 className='text-sm font-semibold text-gray-900 dark:text-white mb-4'>목차</h2>
        <ul className='space-y-1 text-sm'>
          {headings.map((heading) => {
            const indentClass = heading.level === 3 ? 'ml-4' : 'ml-0';

            return (
              <li key={heading.id}>
                <Link
                  href={`#${heading.id}`}
                  className={`block py-1 px-2 rounded transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 ${indentClass}`}
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
