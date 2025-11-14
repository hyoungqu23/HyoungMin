import { z } from "zod";

export const postMetaSchema = z.object({
  title: z.string().min(1),
  createdAt: z.coerce.date(),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostMeta = z.infer<typeof postMetaSchema>;
