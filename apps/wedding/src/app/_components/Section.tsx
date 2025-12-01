import { ComponentProps } from "react";

type SectionProps = ComponentProps<"section">;

export const Section = ({ children, className }: SectionProps) => {
  return (
    <section className={`w-screen min-h-svh ${className}`}>{children}</section>
  );
};
