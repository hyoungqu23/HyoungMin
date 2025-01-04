import { _getArticleFile, _parseArticleFile } from '../lib/articleFile';
import type { TArticle } from '../model/article';

export const getContent = (slug: string): TArticle['content'] => {
  const articleFile = _getArticleFile(slug);
  const { content } = _parseArticleFile(articleFile);

  return content;
};
