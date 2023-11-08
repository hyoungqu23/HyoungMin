import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: `articles/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    createdAt: {
      type: 'date',
      required: true,
    },
    category: {
      type: 'string',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
    },
    image: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
    },
  },
}));

export default makeSource({
  contentDirPath: './src/contents',
  documentTypes: [Article],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'one-dark-pro',
          defaultLang: 'typescript',
          // onVisitLine(node) {
          //   if (node.children.length === 0) {
          //     node.children = [{ type: 'text', value: ' ' }];
          //   }
          // },
          // onVisitHighlightedLine(node) {
          //   node.properties.className.push('line--highlighted');
          // },
          // onVisitHighlightedWord(node) {
          //   node.properties.className = ['word--highlighted'];
          // },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
