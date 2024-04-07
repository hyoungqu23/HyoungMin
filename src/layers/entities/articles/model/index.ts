import {
  type TMetadata,
} from '@shared';
type TArticleService = {
  _parse: (file: string) => { data: TMetadata; content: string };
  _get: (slug: string) => string;
  getPreview: (slug: string) => TMetadata;
  getContent: (slug: string) => string;
  getReadingTime: (content: string) => number;
};
