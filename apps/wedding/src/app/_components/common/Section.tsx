import { ComponentProps } from "react";

type SectionProps = ComponentProps<"section">;

export const Section = ({ children, className }: SectionProps) => {
  return (
    <section className={`w-screen py-8 px-4 ${className}`}>{children}</section>
  );
};

type TitleProps = { category: string; title: string; description?: string };

const Title = ({ category, title, description }: TitleProps) => {
  return (
    <div className="text-center flex flex-col items-center gap-3">
      <p className="text-xs font-bold text-rose-400 tracking-widest uppercase">
        {category}
      </p>
      <h2 className="text-xl font-bold text-stone-800">{title}</h2>
      {description ? (
        <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      ) : null}
    </div>
  );
};

Section.Title = Title;
