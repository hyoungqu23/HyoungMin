import { CodeBlock, MdxImage } from '@hyoungmin/ui';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { ComponentProps } from 'react';

export const mdxComponents: MDXRemoteProps['components'] = {
  pre: (props: ComponentProps<'pre'>) => <CodeBlock {...props} />,
  img: (props: ComponentProps<'img'>) => <MdxImage {...props} />,
};
