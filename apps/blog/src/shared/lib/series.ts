import { readFile } from "fs/promises";
import { join } from "path";

import { z } from "zod";

const SERIES_REGISTRY_PATH = join(process.cwd(), "contents", "series.json");

const seriesEntrySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  cover: z.string().optional(),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color")
    .optional(),
});

const seriesRegistrySchema = z.record(seriesEntrySchema).default({});

export type SeriesInfo = z.infer<typeof seriesEntrySchema>;
export type SeriesRegistry = Record<string, SeriesInfo>;
export type SeriesEntry = SeriesInfo & { id: string };

let registryCache: SeriesRegistry | null = null;

export const getSeriesRegistry = async (): Promise<SeriesRegistry> => {
  if (registryCache) return registryCache;
  try {
    const raw = await readFile(SERIES_REGISTRY_PATH, "utf-8");
    const json = JSON.parse(raw);
    registryCache = seriesRegistrySchema.parse(json);
    return registryCache;
  } catch {
    registryCache = {};
    return registryCache;
  }
};

export const getSeriesEntry = async (
  id: string,
): Promise<SeriesEntry | null> => {
  const registry = await getSeriesRegistry();
  const entry = registry[id];
  if (!entry) return null;
  return { id, ...entry };
};

export const listSeriesEntries = async (): Promise<SeriesEntry[]> => {
  const registry = await getSeriesRegistry();
  return Object.entries(registry).map(([id, entry]) => ({ id, ...entry }));
};
