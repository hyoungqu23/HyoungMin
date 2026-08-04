import { readdir, readFile } from "fs/promises";
import { join } from "path";

// 주의: "portfolio"는 src/app/portfolio 정적 라우트가 우선 매칭하므로
// 포스트 슬러그(파일명)로 사용하면 해당 글이 조용히 가려진다.
const POSTS_DIR = join(process.cwd(), "contents", "posts");

export const listSlugs = async (): Promise<string[]> => {
  const files = await readdir(POSTS_DIR, { withFileTypes: false });
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
};

export const readArticle = async (slug: string): Promise<string> => {
  const filePath = join(POSTS_DIR, `${slug}.mdx`);
  const content = await readFile(filePath, "utf-8");
  return content;
};
