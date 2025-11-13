import Link from 'next/link';
import ThemeToggle from '@/features/theme-toggle/ThemeToggle';
import ShareButton from '@/features/share/ShareButton';

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
          {/* 다크모드 토글 버튼 */}
          <ThemeToggle />

          {/* 공유하기 버튼 */}
          <ShareButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;

