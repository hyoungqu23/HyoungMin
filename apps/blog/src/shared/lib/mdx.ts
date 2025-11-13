import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { postMetaSchema } from '@hyoungmin/schema';

const prettyCodeOptions: Options = {
  theme: { light: 'github-light', dark: 'one-dark-pro' },
  keepBackground: false,
  filterMetaString: (meta) => meta, // title/filename/meta 그대로 유지
  onVisitLine: (node) => {
    // 빈 줄 렌더 유지
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine: (node) => {
    node.properties.className = (node.properties.className || []).concat('highlighted');
  },
  onVisitHighlightedChars: (node: any) => {
    node.properties.className = (node.properties.className || []).concat('word--highlighted');
  },
};

export const compilePostMDX = async (source: string, components: Record<string, any>) => {
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
    components,
  });

  const meta = postMetaSchema.parse(frontmatter);
  return { content, meta };
};

