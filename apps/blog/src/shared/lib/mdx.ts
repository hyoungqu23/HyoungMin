import { postMetaSchema } from '@hyoungmin/schema';
import { compileMDX, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { Element, Root } from 'hast';
import { rehypeExtractHeadings } from './rehype-extract-headings';
import type { TocItem } from './rehype-extract-headings';

const prettyCodeOptions: Options = {
  theme: { light: 'github-light', dark: 'one-dark-pro' },
  keepBackground: false,
  filterMetaString: (meta) => meta,
  onVisitLine: (node) => {
    // 빈 줄 렌더 유지
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine: (node) => {
    const className = node.properties.className;
    if (Array.isArray(className)) {
      const stringArray = className.filter((c): c is string => typeof c === 'string');
      node.properties.className = [...stringArray, 'highlighted'];
    } else if (typeof className === 'string') {
      node.properties.className = [className, 'highlighted'];
    } else {
      node.properties.className = ['highlighted'];
    }
  },
  onVisitHighlightedChars: (node: Element) => {
    const className = node.properties.className;
    if (Array.isArray(className)) {
      const stringArray = className.filter((c): c is string => typeof c === 'string');
      node.properties.className = [...stringArray, 'word--highlighted'];
    } else if (typeof className === 'string') {
      node.properties.className = [className, 'word--highlighted'];
    } else {
      node.properties.className = ['word--highlighted'];
    }
  },
};

export const compilePostMDX = async (
  source: string,
  components: MDXRemoteProps['components']
) => {
  const headings: TocItem[] = [];

  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypeExtractHeadings, { headings }],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
    components,
  });

  const meta = postMetaSchema.parse(frontmatter);
  return { content, meta, headings };
};
