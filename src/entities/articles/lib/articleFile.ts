import fs from 'fs';
import path from 'path';
import { CONTENTS_PATH_MAP } from '@shared/config';
import { getRootDirectoryPath } from '@shared/lib';
import matter from 'gray-matter';
import type { TArticle, TMetadataOfArticle } from '../model/article';

export const _getArticleFile = (slug: string) => {
  const articlePath = path.join(
    getRootDirectoryPath(),
    CONTENTS_PATH_MAP.ROOT,
    CONTENTS_PATH_MAP.ARTICLES,
    `${slug}.mdx`,
  );

  return fs.readFileSync(articlePath, 'utf-8');
};

export const _parseArticleFile = (articleFile: string): TArticle => {
  const { data, content } = matter(articleFile);

  return { metadata: data as TMetadataOfArticle, content };
};
