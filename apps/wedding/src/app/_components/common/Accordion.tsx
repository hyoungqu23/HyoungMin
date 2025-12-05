import CaretDown from "@icons/caret_down.svg";
import Image from "next/image";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  name: string;
};

export const Accordion = ({ title, children, name }: AccordionProps) => {
  return (
    <details
      name={name}
      className="w-full mb-3 last:mb-0 overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm group"
    >
      <summary className="flex w-full items-center justify-between px-5 py-4 bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer list-none">
        <span className="font-bold text-stone-700">{title}</span>
        <span className="text-rose-400 transition-transform duration-300 group-open:rotate-180">
          <Image src={CaretDown} alt="Chevron Down" width={24} height={24} />
        </span>
      </summary>

      <div className="px-5 py-2">{children}</div>
    </details>
  );
};
