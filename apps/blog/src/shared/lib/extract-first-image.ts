import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * MDX 소스에서 첫 번째 이미지 URL을 추출합니다.
 * @param source MDX 소스 문자열
 * @returns 첫 번째 이미지 URL 또는 null
 */
export const extractFirstImage = (source: string): string | null => {
  // 마크다운 이미지 패턴: ![alt](url) 또는 <img src="url" />
  const markdownImagePattern = /!\[.*?\]\((.*?)\)/;
  const htmlImagePattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;

  // 마크다운 이미지 패턴 먼저 확인
  const markdownMatch = source.match(markdownImagePattern);
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1];
  }

  // HTML 이미지 태그 확인
  const htmlMatch = source.match(htmlImagePattern);
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }

  return null;
};

/**
 * rehype 플러그인: 첫 번째 이미지 URL을 추출하여 옵션의 firstImage에 저장
 */
export const rehypeExtractFirstImage = (options: {
  firstImage: string | null;
}) => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img" && !options.firstImage) {
        const src = node.properties?.src;
        if (typeof src === "string" && src) {
          options.firstImage = src;
        }
      }
    });
  };
};
