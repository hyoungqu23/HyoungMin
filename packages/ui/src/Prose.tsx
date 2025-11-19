import { PropsWithChildren } from "react";

export const Prose = ({ children }: PropsWithChildren) => (
  <article className="prose">{children}</article>
);
