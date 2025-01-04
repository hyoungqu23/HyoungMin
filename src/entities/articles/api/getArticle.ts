import { _getArticleFile, _parseArticleFile } from '../lib/articleFile';
import type { TArticle } from '../model/article';

export const getArticle = (slug: string): TArticle => {
  const articleFile = _getArticleFile(slug);
  const { metadata, content } = _parseArticleFile(articleFile);

  return { metadata, content };
};
