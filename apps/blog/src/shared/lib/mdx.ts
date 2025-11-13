import { postMetaSchema } from '@hyoungmin/schema';
import { compileMDX, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { Element, Root } from 'hast';

const prettyCodeOptions: Options = {
  theme: { light: 'github-light', dark: 'one-dark-pro' },
  keepBackground: false,
  filterMetaString: (meta) => {
    // title="filename" 형식에서 파일명 추출
    const titleMatch = meta.match(/title="([^"]+)"/);
    if (titleMatch && titleMatch[1]) {
      // 파일명을 반환 (rehype-pretty-code가 이를 title로 사용)
      return titleMatch[1];
    }
    // title="filename"을 제거하고 나머지 메타데이터 반환
    const cleaned = meta.replace(/title="[^"]+"/, '').trim();
    return cleaned.length > 0 ? cleaned : meta;
  },
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
