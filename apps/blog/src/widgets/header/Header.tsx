import Link from 'next/link';

const Header = () => {
  return (
    <header className='fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
      {/* Skip link - 접근성 필수 */}
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        Skip to main content
      </a>

      <div className='container mx-auto px-4 h-full flex items-center justify-between'>
        {/* 로고/사이트명 */}
        <Link
          href='/'
          className='text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
        >
          Blog
        </Link>

        {/* 우측 액션 버튼들 */}
        <nav className='flex items-center gap-4' aria-label='Header navigation'>
          {/* 다크모드 토글 버튼 (11.2에서 구현 예정) */}
          <button
            type='button'
            aria-label='Toggle theme'
            className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            disabled
          >
            <span className='sr-only'>Theme toggle (coming soon)</span>
            <svg
              className='w-5 h-5 text-gray-700 dark:text-gray-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
              />
            </svg>
          </button>

          {/* 공유하기 버튼 (11.5에서 구현 예정) */}
          <button
            type='button'
            aria-label='Share'
            className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            disabled
          >
            <span className='sr-only'>Share (coming soon)</span>
            <svg
              className='w-5 h-5 text-gray-700 dark:text-gray-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
              />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

