import Link from "next/link";

import ThemeToggle from "@/features/theme-toggle/ThemeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 right-0 z-40 flex items-center justify-center border-b border-zinc-950/15 bg-stone-50/90 backdrop-blur-xl dark:border-stone-50/20 dark:bg-zinc-950/90">
      {/* Skip link - 접근성 필수 */}
      <Link
        href="/#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-secondary-400 focus:text-primary-900 focus:rounded focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2"
      >
        Skip to main content
      </Link>

      <div className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between px-4 lg:h-[4.5rem]">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          <span className="flex size-8 items-center justify-center bg-zinc-950 text-xs font-black text-white transition-transform duration-200 group-hover:-rotate-3 dark:bg-stone-50 dark:text-zinc-950">
            HM
          </span>
          <span className="leading-none">
            <span className="block text-sm font-black tracking-[-0.02em]">
              Hyoungmin
            </span>
            <span className="mt-1 block text-[0.6rem] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
              Product engineer · Notes
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label="주요 탐색" className="hidden items-center sm:flex">
            <a
              href="/#latest"
              className="flex min-h-11 items-center border-b-2 border-transparent px-3 text-xs font-bold tracking-wider uppercase transition-colors duration-200 hover:border-current focus-visible:border-current focus-visible:outline-none"
            >
              Writing
            </a>
            <a
              href="/#series"
              className="flex min-h-11 items-center border-b-2 border-transparent px-3 text-xs font-bold tracking-wider uppercase transition-colors duration-200 hover:border-current focus-visible:border-current focus-visible:outline-none"
            >
              Series
            </a>
          </nav>
          <Link
            href="/portfolio"
            className="hidden min-h-11 items-center border border-current px-4 text-xs font-bold tracking-wider uppercase transition-colors duration-200 hover:bg-zinc-950 hover:text-white md:flex dark:hover:bg-stone-50 dark:hover:text-zinc-950"
          >
            Portfolio
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
