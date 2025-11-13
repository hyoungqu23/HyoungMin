import { INFORMATION, SKILLS } from "./config";

const INFINITE_CAROUSEL_ITEMS = INFORMATION.concat(SKILLS);

const InfiniteSkills = () => {
  return (
    <section className="relative mx-auto w-[1608.73px] h-14 overflow-x-hidden">
      <div className="absolute z-10 w-[calc(100vw+24px)] min-[1610px]:w-[calc(100%+24px)] -left-3 -right-3 h-full bg-linear-to-r from-secondary-500 from-1% via-transparent to-99% to-secondary-500" />
      <div className="absolute w-[200%] flex gap-2 animate-infinite-carousel">
        <ul className="flex gap-2 w-fit">
          {INFINITE_CAROUSEL_ITEMS.map((item) => (
            <li
              key={item}
              className="px-3 py-2 font-extrabold whitespace-nowrap text-primary-50 text-heading5"
            >
              {item}
            </li>
          ))}
        </ul>
        <ul className="flex gap-2 w-fit">
          {INFINITE_CAROUSEL_ITEMS.map((item) => (
            <li
              key={item}
              className="px-3 py-2 font-extrabold whitespace-nowrap text-primary-50 text-heading5"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default InfiniteSkills;
