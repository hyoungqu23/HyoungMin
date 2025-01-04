import fs from 'fs';
import path from 'path';
import { CONTENTS_PATH_MAP } from '@shared/config';
import { getRootDirectoryPath } from '@shared/lib';
import { _parseArticleFile } from '../lib/articleFile';
import type { TPreviewOfArticle } from '../model/article';
import { getPreviewOfArticle } from './getPreviewOfArticle';

export const getArticles = (): Array<TPreviewOfArticle> => {
  const articlesPath = path.join(getRootDirectoryPath(), CONTENTS_PATH_MAP.ROOT, CONTENTS_PATH_MAP.ARTICLES);

  const slugOfArticles = fs.readdirSync(articlesPath);

  return slugOfArticles
    .map((slug) => getPreviewOfArticle(slug.replace('.mdx', '')))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
