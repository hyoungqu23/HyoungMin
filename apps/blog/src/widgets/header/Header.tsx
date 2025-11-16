import Link from "next/link";

import ThemeToggle from "@/features/theme-toggle/ThemeToggle";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-primary-200 backdrop-blur-sm bg-opacity-95">
      {/* Skip link - 접근성 필수 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-secondary-400 focus:text-primary-900 focus:rounded focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* 로고/사이트명 */}
        <Link
          href="/"
          className="text-xl font-bold text-primary-900 hover:text-secondary-400 transition-colors"
        >
          Blog
        </Link>

        {/* 우측 액션 버튼들 */}
        <nav className="flex items-center gap-4" aria-label="Header navigation">
          {/* 다크모드 토글 버튼 */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
