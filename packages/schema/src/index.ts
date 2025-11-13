import { z } from 'zod';

export const postMetaSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostMeta = z.infer<typeof postMetaSchema>;
