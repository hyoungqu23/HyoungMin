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
      className="w-full mb-3 last:mb-0 overflow-hidden rounded-xl bg-white shadow-sm group"
    >
      <summary className="flex w-full items-center justify-between px-5 py-4 bg-primary/10 hover:bg-primary/10 transition-colors cursor-pointer list-none">
        <span className="font-bold text-black">{title}</span>
        <span className="text-primary transition-transform duration-300 group-open:rotate-180">
          <Image src={CaretDown} alt="Chevron Down" width={24} height={24} />
        </span>
      </summary>

      <div className="px-5 py-2">{children}</div>
    </details>
  );
};
