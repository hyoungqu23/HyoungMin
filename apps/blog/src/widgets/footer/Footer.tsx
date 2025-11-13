import Link from "next/link";

import InfiniteSkills from "./InfiniteSkills";
import { COPYRIGHT } from "./config";

import { EXTERNAL_LINKS } from "@/shared/config/external-links";

const Footer = () => {
  return (
    <footer className="w-full mt-auto bg-gray-900 dark:bg-gray-950 border-t border-gray-800 dark:border-gray-900">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
        <InfiniteSkills />
        <ul className="flex flex-row flex-wrap justify-end font-medium gap-x-6 gap-y-2 text-sm md:text-base">
          {Object.values(EXTERNAL_LINKS).map((link) =>
            link.href ? (
              <li key={link.id}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors text-gray-400 hover:text-gray-200 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {link.id.toUpperCase()}
                </Link>
              </li>
            ) : null,
          )}
        </ul>
        <span className="block text-center text-gray-500 dark:text-gray-600 text-xs md:text-sm">
          {COPYRIGHT}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
