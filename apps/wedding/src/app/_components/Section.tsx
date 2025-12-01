import { ComponentProps } from "react";

type SectionProps = ComponentProps<"section">;

export const Section = ({ children, className }: SectionProps) => {
  return (
    <section className={`w-screen min-h-svh px-4 ${className}`}>
      {children}
    </section>
  );
};
