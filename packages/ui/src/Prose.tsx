import { PropsWithChildren } from 'react';

export const Prose = ({ children }: PropsWithChildren) => (
  <article className='prose dark:prose-invert max-w-3xl mx-auto'>{children}</article>
);

