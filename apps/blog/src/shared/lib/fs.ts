import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const POSTS_DIR = join(process.cwd(), 'contents', 'posts');

export const listSlugs = async (): Promise<string[]> => {
  const files = await readdir(POSTS_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
};

export const readArticle = async (slug: string): Promise<string> => {
  const filePath = join(POSTS_DIR, `${slug}.mdx`);
  const content = await readFile(filePath, 'utf-8');
  return content;
};

