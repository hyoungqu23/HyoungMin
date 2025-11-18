import { COPYRIGHT, INFORMATION, SKILLS } from "./config";

import { EXTERNAL_LINKS } from "@/shared/config/external-links";

const INFINITE_CAROUSEL_ITEMS = INFORMATION.concat(SKILLS);

const Footer = () => {
  return (
    <footer className="w-full bg-primary-900 border-t border-primary-800">
      <div className="container px-4 py-8 flex flex-col gap-1 justify-end items-end">
        <ul className="flex gap-2 w-fit">
          {INFINITE_CAROUSEL_ITEMS.map((item) => (
            <li
              key={item}
              className="px-3 py-2 font-extrabold whitespace-nowrap text-primary-100"
            >
              {item}
            </li>
          ))}
        </ul>
        <ul className="flex flex-row flex-wrap justify-end font-medium gap-x-6 gap-y-2 text-sm md:text-base">
          {Object.values(EXTERNAL_LINKS).map((link) =>
            link.href ? (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors text-primary-300 hover:text-primary-100"
                >
                  {link.id.toUpperCase()}
                </a>
              </li>
            ) : null,
          )}
        </ul>
        <span className="block text-center text-primary-400 text-xs md:text-sm">
          {COPYRIGHT}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
