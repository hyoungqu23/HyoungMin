import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

type ExtractHeadingsOptions = {
  headings: TocItem[];
};

/**
 * rehype 플러그인: 헤딩(h2, h3) 정보를 추출하여 옵션의 headings 배열에 저장
 */
export const rehypeExtractHeadings = (options: ExtractHeadingsOptions) => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "h2" || node.tagName === "h3") {
        const id = (node.properties?.id as string) || "";
        const level = parseInt(node.tagName.charAt(1), 10);

        // 텍스트 추출
        let text = "";
        visit(node, "text", (textNode) => {
          if (textNode.type === "text") {
            text += textNode.value;
          }
        });

        // 링크 내부 텍스트도 추출 (rehype-autolink-headings로 감싸진 경우)
        if (!text) {
          visit(node, "element", (child: Element) => {
            if (child.tagName === "a") {
              visit(child, "text", (textNode) => {
                if (textNode.type === "text") {
                  text += textNode.value;
                }
              });
            }
          });
        }

        if (id && text) {
          options.headings.push({ id, text, level });
        }
      }
    });
  };
};
