import { ComponentProps } from "react";

type SectionProps = ComponentProps<"section">;

export const Section = ({ children, className, ...props }: SectionProps) => {
  return (
    <section
      {...props}
      className={`w-screen py-8 px-4 max-w-md mx-auto ${className ?? ""}`}
    >
      {children}
    </section>
  );
};

type TitleProps = { category: string; title: string; description?: string };

const Title = ({ category, title, description }: TitleProps) => {
  return (
    <div className="text-center flex flex-col items-center gap-3">
      <p className="text-xs font-bold text-rose-400 tracking-widest uppercase font-cafe24">
        {category}
      </p>
      <h2 className="text-xl font-bold text-stone-800 font-cafe24">{title}</h2>
      {description ? (
        <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      ) : null}
    </div>
  );
};

Section.Title = Title;
