import {
  CONTENTS_PATH_MAP,
  getRootDirectoryPath,
  type TMetadata,
} from '@shared';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { _calculateReadingTimePerMinute } from '../lib/utils';
import type { TArticleService } from '../model';

export const articleService: TArticleService = {
  _parse: (articleFile) => {
    const { data, content } = matter<TMetadata, string, {}>(articleFile);

    return { data, content };
  },
  _get: (slug) => {
    const articlePath = path.join(
      getRootDirectoryPath(),
      CONTENTS_PATH_MAP.ROOT,
      CONTENTS_PATH_MAP.ARTICLES,
      `${slug}.mdx`,
    );

    return fs.readFileSync(articlePath, 'utf-8');
  },
  _getReadingTime: (article: string) => {
    return _calculateReadingTimePerMinute(article);
  },
  getPreview: (slug) => {
    const articleFile = articleService._get(slug);

    const { data, content } = articleService._parse(articleFile);

    return {
      ...data,
      thumbnail: {
        src: data.thumbnail,
        alt: `${data.title} Thumbnail Image`,
      },
      readingTime: articleService._getReadingTime(content),
      slug,
    };
  },
  getContent: (slug) => {
    const articleFile = articleService._get(slug);

    return articleService._parse(articleFile).content;
  },
};
