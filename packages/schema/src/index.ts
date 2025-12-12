import { z } from "zod";

export const postMetaSchema = z.object({
  title: z.string().min(1),
  createdAt: z.coerce.date(),
  description: z.string().min(1),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).default([]),
  series: z.string().min(1).optional(),
  seriesOrder: z.coerce.number().int().min(0).optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostMeta = z.infer<typeof postMetaSchema>;
