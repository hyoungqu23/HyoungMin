import { z } from 'zod';

export const metadataOfArticleSchema = z.object({
  title: z.string(),
  createdAt: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.object({
    src: z.string(),
    alt: z.string(),
  }),
});

export const articleSchema = z.object({
  metadata: metadataOfArticleSchema,
  content: z.string(),
});

export const previewOfArticleSchema = z.object({
  title: z.string(),
  createdAt: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.object({
    src: z.string(),
    alt: z.string(),
  }),
  readingTime: z.number(),
  slug: z.string(),
  views: z.number().optional(),
});

export type TMetadataOfArticle = z.infer<typeof metadataOfArticleSchema>;
export type TArticle = z.infer<typeof articleSchema>;
export type TPreviewOfArticle = z.infer<typeof previewOfArticleSchema>;
