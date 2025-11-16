import InfiniteSkills from "./InfiniteSkills";
import { COPYRIGHT } from "./config";

import { EXTERNAL_LINKS } from "@/shared/config/external-links";

const Footer = () => {
  return (
    <footer className="w-full mt-auto bg-primary-900 border-t border-primary-800">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
        <InfiniteSkills />
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
