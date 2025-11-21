import { createHash } from "crypto";

import { postMetaSchema, type PostMeta } from "@hyoungmin/schema";
import { compileMDX } from "next-mdx-remote/rsc";

import { extractFirstImage } from "./extract-first-image";
import { listSlugs, readArticle } from "./fs";

type PostSummary = {
  slug: string;
  meta: PostMeta;
  firstImage: string | null;
};

type CachedSummary = PostSummary & { hash: string };

const metaCache = new Map<string, CachedSummary>();

const hashSource = (source: string) =>
  createHash("md5").update(source).digest("hex");

const parseMeta = async (source: string) => {
  // frontmatter만 가볍게 파싱 (remark/rehype 플러그인 없이)
  const { frontmatter } = await compileMDX({
    source,
    components: {},
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
  });

  const meta = postMetaSchema.parse(frontmatter);
  const firstImage = extractFirstImage(source);

  return { meta, firstImage };
};

export const getPostSummary = async (slug: string): Promise<PostSummary> => {
  const source = await readArticle(slug);
  const hash = hashSource(source);
  const cached = metaCache.get(slug);

  if (cached && cached.hash === hash) {
    return cached;
  }

  const { meta, firstImage } = await parseMeta(source);
  const summary = { slug, meta, firstImage, hash };
  metaCache.set(slug, summary);
  return summary;
};

export const getAllPostSummaries = async (): Promise<PostSummary[]> => {
  const slugs = await listSlugs();
  const summaries = await Promise.all(
    slugs.map((slug) => getPostSummary(slug)),
  );
  return summaries;
};
