import {
  CONTENTS_PATH_MAP,
  getRootDirectoryPath,
  type TMetadata,
} from '@shared';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { _calculateReadingTimePerMinute } from '../lib/utils';

type TArticleService = {
  _parse: (file: string) => { data: TMetadata; content: string };
  _get: (slug: string) => string;
  getPreview: (slug: string) => TMetadata;
  getContent: (slug: string) => string;
  getReadingTime: (content: string) => number;
};

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
  getPreview: (slug) => {
    const articleFile = articleService._get(slug);

    return articleService._parse(articleFile).data;
  },
  getContent: (slug) => {
    const articleFile = articleService._get(slug);

    return articleService._parse(articleFile).content;
  },
  getReadingTime: (article: string) => {
    return _calculateReadingTimePerMinute(article);
  },
};