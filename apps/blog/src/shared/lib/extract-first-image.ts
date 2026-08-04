import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * MDX 소스에서 첫 번째 이미지 URL을 추출합니다.
 * @param source MDX 소스 문자열
 * @returns 첫 번째 이미지 URL 또는 null
 */
export const extractFirstImage = (source: string): string | null => {
  // 1. 펜스된 코드 블록( ``` ... ``` ) 안의 내용은 모두 제거해서
  //    코드 예시 안의 <img>가 썸네일 후보로 잡히지 않게 한다.
  const withoutCodeBlocks = source.replace(/```[\s\S]*?```/g, "");

  // 2. 마크다운 / HTML 이미지 패턴: ![alt](url) 또는 <img src="url" />
  const markdownImagePattern = /!\[.*?\]\((.*?)\)/;
  const htmlImagePattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;

  const markdownMatch = withoutCodeBlocks.match(markdownImagePattern);
  const htmlMatch = withoutCodeBlocks.match(htmlImagePattern);

  const images = [markdownMatch, htmlMatch]
    .filter(
      (match): match is RegExpMatchArray =>
        Boolean(match?.[1]) && match?.index !== undefined,
    )
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  return images[0]?.[1] ?? null;
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
