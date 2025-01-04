import { _getArticleFile, _parseArticleFile } from '../lib/articleFile';
import { _calculateReadingTimePerMinute } from '../lib/readingTime';
import type { TPreviewOfArticle } from '../model/article';

export const getPreviewOfArticle = (slug: string): TPreviewOfArticle => {
  const articleFile = _getArticleFile(slug);
  const { metadata, content } = _parseArticleFile(articleFile);

  return {
    ...metadata,
    thumbnail: {
      src: metadata.thumbnail?.src ?? metadata.thumbnail,
      alt: `${metadata.title} Thumbnail Image`,
    },
    readingTime: _calculateReadingTimePerMinute(content),
    slug,
  };
};
