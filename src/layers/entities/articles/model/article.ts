import { TImageProps, type TMetadata } from '@shared';

export type TArticlePreview = Omit<TMetadata, 'thumbnail'> & {
  slug: string;
  thumbnail: TImageProps;
  readingTime: number;
  views?: number;
};

export type TArticleService = {
  _parse: (file: string) => { data: TMetadata; content: string };
  _get: (slug: string) => string;
  _getReadingTime: (content: string) => number;
  getPreview: (slug: string) => TArticlePreview;
  getContent: (slug: string) => string;
};
