import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readdir, readFile } from 'fs/promises';
import { listSlugs, readArticle } from '../fs';

vi.mock('fs/promises', () => {
  const readdir = vi.fn();
  const readFile = vi.fn();
  return {
    default: {
      readdir,
      readFile,
    },
    readdir,
    readFile,
  };
});

vi.mock('process', () => ({
  cwd: vi.fn(() => '/test'),
}));

describe('fs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listSlugs', () => {
    it('should return slugs from .mdx files', async () => {
      const mockFiles: string[] = ['post1.mdx', 'post2.mdx', 'readme.txt', 'post3.mdx'];
      vi.mocked(readdir).mockResolvedValue(mockFiles);

      const result = await listSlugs();

      expect(result).toEqual(['post1', 'post2', 'post3']);
    });

    it('should return empty array when no .mdx files exist', async () => {
      const mockFiles: string[] = ['readme.txt', 'config.json'];
      vi.mocked(readdir).mockResolvedValue(mockFiles);

      const result = await listSlugs();

      expect(result).toEqual([]);
    });
  });

  describe('readArticle', () => {
    it('should read and return article content', async () => {
      const mockContent = '---\ntitle: Test\n---\n\nContent';
      vi.mocked(readFile).mockResolvedValue(mockContent);

      const result = await readArticle('test-slug');

      expect(result).toBe(mockContent);
      expect(readFile).toHaveBeenCalledWith(
        expect.stringContaining('contents/posts/test-slug.mdx'),
        'utf-8'
      );
    });
  });
});
