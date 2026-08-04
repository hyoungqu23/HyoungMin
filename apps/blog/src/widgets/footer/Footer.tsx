import type { Route } from "next";
import Link from "next/link";

import { COPYRIGHT, INFORMATION, SKILLS } from "./config";

import { EXTERNAL_LINKS } from "@/shared/config/external-links";

const INTRODUCTION_ITEMS = INFORMATION.concat(SKILLS);
const FOOTER_LINKS = [
  EXTERNAL_LINKS.PORTFOLIO,
  EXTERNAL_LINKS.INSTAGRAM,
  EXTERNAL_LINKS.LINKEDIN,
  EXTERNAL_LINKS.GMAIL,
  EXTERNAL_LINKS.KAKAO_TALK_OPEN_CHAT,
];

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-current bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-stone-50">
      <div className="mx-auto grid w-full max-w-[96rem] gap-8 px-4 pb-12 pt-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-lg font-black">Hyoungmin Lee</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            제품의 문제를 구조화하고, 프론트엔드 기술로 풀어낸 과정과 판단을
            기록합니다.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 md:justify-end">
          {INTRODUCTION_ITEMS.map((item) => (
            <li
              key={item}
              className="whitespace-nowrap px-2 py-2 text-xs font-bold tracking-wider uppercase"
            >
              {item}
            </li>
          ))}
        </ul>
        <ul className="flex flex-row flex-wrap gap-x-5 gap-y-2 text-xs font-bold tracking-wider uppercase md:col-start-2 md:justify-end">
          {FOOTER_LINKS.map((link) => {
            if (!link.href) return null;

            // "/portfolio" 같은 내부 경로는 새 탭 없이 클라이언트 네비게이션
            const isInternal =
              link.href.startsWith("/") && !link.href.endsWith(".pdf");

            return (
              <li key={link.id}>
                {isInternal ? (
                  <Link
                    href={link.href as Route}
                    className="block min-h-11 content-center transition-colors hover:underline"
                  >
                    {link.id.toUpperCase()}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block min-h-11 content-center transition-colors hover:underline"
                  >
                    {link.id.toUpperCase()}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <span className="text-xs text-zinc-500 md:col-start-2 md:text-right dark:text-zinc-400">
          {COPYRIGHT}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
