import { postMetaSchema } from "@hyoungmin/schema";
import type { Element } from "hast";
import { compileMDX, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import {
  extractFirstImage,
  rehypeExtractFirstImage,
} from "./extract-first-image";
import { rehypeExtractHeadings } from "./rehype-extract-headings";
import type { TocItem } from "./rehype-extract-headings";

const prettyCodeOptions: Options = {
  theme: { light: "github-light", dark: "one-dark-pro" },
  keepBackground: false,
  filterMetaString: (meta) => meta,
  onVisitLine: (node) => {
    // 빈 줄 렌더 유지
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine: (node) => {
    const className = node.properties.className;
    if (Array.isArray(className)) {
      const stringArray = className.filter(
        (c): c is string => typeof c === "string",
      );
      node.properties.className = [...stringArray, "highlighted"];
    } else if (typeof className === "string") {
      node.properties.className = [className, "highlighted"];
    } else {
      node.properties.className = ["highlighted"];
    }
  },
  onVisitHighlightedChars: (node: Element) => {
    const className = node.properties.className;
    if (Array.isArray(className)) {
      const stringArray = className.filter(
        (c): c is string => typeof c === "string",
      );
      node.properties.className = [...stringArray, "word--highlighted"];
    } else if (typeof className === "string") {
      node.properties.className = [className, "word--highlighted"];
    } else {
      node.properties.className = ["word--highlighted"];
    }
  },
};

export const compilePostMDX = async (
  source: string,
  components: MDXRemoteProps["components"],
) => {
  const headings: TocItem[] = [];
  const firstImageState: { firstImage: string | null } = { firstImage: null };

  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypeExtractHeadings, { headings }],
          [rehypeExtractFirstImage, firstImageState],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
    components,
  });

  const meta = postMetaSchema.parse(frontmatter);

  // 첫 번째 이미지 추출 (rehype 플러그인으로 추출 실패 시 정규식으로 재시도)
  const firstImage = firstImageState.firstImage || extractFirstImage(source);

  return { content, meta, headings, firstImage };
};
