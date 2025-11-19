import Link from "next/link";

import ThemeToggle from "@/features/theme-toggle/ThemeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 right-0 z-40 flex items-center justify-center h-20 bg-primary-50/10 border-b-2 border-primary-300 backdrop-blur-sm bg-opacity-95">
      {/* Skip link - 접근성 필수 */}
      <Link
        href="/#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-secondary-400 focus:text-primary-900 focus:rounded focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2"
      >
        Skip to main content
      </Link>

      <div className="container px-4 h-full flex items-center justify-between">
        {/* 로고/사이트명 */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary-100 hover:text-secondary-400 transition-colors"
        >
          HyoungMin
        </Link>

        {/* 다크모드 토글 버튼 */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
33;
