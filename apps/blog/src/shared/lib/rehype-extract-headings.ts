import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

/**
 * rehype 플러그인: 헤딩(h2, h3) 정보를 추출하여 데이터로 저장
 */
export const rehypeExtractHeadings = () => {
  return (tree: Root, file: { data: { headings?: TocItem[] } }) => {
    const headings: TocItem[] = [];

    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        const id = (node.properties?.id as string) || '';
        const level = parseInt(node.tagName.charAt(1), 10);

        // 텍스트 추출
        let text = '';
        visit(node, 'text', (textNode) => {
          text += textNode.value;
        });

        // 링크 내부 텍스트도 추출 (rehype-autolink-headings로 감싸진 경우)
        if (!text) {
          visit(node, 'element', (child: Element) => {
            if (child.tagName === 'a') {
              visit(child, 'text', (textNode) => {
                text += textNode.value;
              });
            }
          });
        }

        if (id && text) {
          headings.push({ id, text, level });
        }
      }
    });

    // 파일 데이터에 헤딩 정보 저장
    file.data.headings = headings;
  };
};

