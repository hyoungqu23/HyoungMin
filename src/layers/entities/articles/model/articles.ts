import { TArticlePreview } from './article';

export type TArticlesService = {
  filter: (filterBy: string) => Array<TArticlePreview>;
  get: () => Array<TArticlePreview>;
};
