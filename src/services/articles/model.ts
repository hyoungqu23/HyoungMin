import type { Article } from '@contentlayer';

export interface IArticle extends Article {}

export interface IArticlePreview
  extends Pick<
    IArticle,
    'title' | 'description' | 'category' | 'createdAt' | 'tags' | 'slug'
  > {
  thumbnail: {
    src?: string;
    alt: string;
  };
}
