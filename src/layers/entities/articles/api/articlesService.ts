import { CONTENTS_PATH_MAP, getRootDirectoryPath } from '@shared';
import fs from 'fs';
import path from 'path';
import { TArticlesService } from '../model';
import { articleService } from './articleService';

export const articlesService: TArticlesService = {
  get: () => {
    const articlesPath = path.join(getRootDirectoryPath(), CONTENTS_PATH_MAP.ROOT, CONTENTS_PATH_MAP.ARTICLES);

    const slugOfArticles = fs.readdirSync(articlesPath);

    return slugOfArticles
      .map((slug) => articleService.getPreview(slug.replace('.mdx', '')))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  filter: (filterBy) => {
    const articles = articlesService.get();

    return articles.filter((article) => article.category.toLowerCase().replaceAll('.', '') === filterBy);
  },
};
