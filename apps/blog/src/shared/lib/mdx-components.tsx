import { CodeBlock, MdxImage, Prose } from '@hyoungmin/ui';

export const mdxComponents = {
  pre: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => <MdxImage {...props} />,
} as const;

