import type { PostMeta } from "@hyoungmin/schema";
import { Prose } from "@hyoungmin/ui";
import type { Route } from "next";
import Link from "next/link";

import ShareButton from "@/features/share/ShareButton";
import { siteUrl } from "@/shared/config/site";
import type { TocItem } from "@/shared/lib/rehype-extract-headings";
import type { PostWithSlug } from "@/shared/lib/related-posts";
import type { SeriesEntry } from "@/shared/lib/series";
import ReadingProgress from "@/widgets/reading-progress/ReadingProgress";

type EditorialArticleProps = {
  content: React.ReactNode;
  headings: TocItem[];
  meta: PostMeta;
  readingTime: number;
  relatedPosts: PostWithSlug[];
  seriesEntry: SeriesEntry | null;
  slug: string;
};

const articleHref = (slug: string) => `/${slug}` as Route;

export const EditorialArticle = ({
  content,
  headings,
  meta,
  readingTime,
  relatedPosts,
  seriesEntry,
  slug,
}: EditorialArticleProps) => (
  <>
    <ReadingProgress />
    <style>{`
      [data-editorial-article] .prose {
        --tw-prose-body: #3f3f46;
        --tw-prose-headings: #09090b;
        --tw-prose-lead: #52525b;
        --tw-prose-links: #a16207;
        --tw-prose-bold: #09090b;
        --tw-prose-counters: #71717a;
        --tw-prose-bullets: #a1a1aa;
        --tw-prose-hr: #d4d4d8;
        --tw-prose-quotes: #3f3f46;
        --tw-prose-quote-borders: #f59e0b;
        --tw-prose-captions: #71717a;
        --tw-prose-code: #27272a;
        --tw-prose-pre-code: #e4e4e7;
        --tw-prose-pre-bg: #18181b;
        --tw-prose-th-borders: #a1a1aa;
        --tw-prose-td-borders: #d4d4d8;
        max-width: none;
        color: #27272a;
        font-size: 1.075rem;
        line-height: 1.9;
      }
      [data-editorial-article] .prose > :first-child { margin-top: 0; }
      [data-editorial-article] .prose h1,
      [data-editorial-article] .prose h2,
      [data-editorial-article] .prose h3,
      [data-editorial-article] .prose h4,
      [data-editorial-article] .prose h5,
      [data-editorial-article] .prose h6 {
        color: #09090b;
        letter-spacing: -0.035em;
      }
      [data-editorial-article] .prose h1 a,
      [data-editorial-article] .prose h2 a,
      [data-editorial-article] .prose h3 a,
      [data-editorial-article] .prose h4 a,
      [data-editorial-article] .prose h5 a,
      [data-editorial-article] .prose h6 a {
        color: inherit;
        text-decoration: none;
      }
      [data-editorial-article] .prose a { color: #a16207; }
      [data-editorial-article] .prose strong { color: #09090b; }
      [data-editorial-article] .prose h2 {
        margin-top: 4rem;
        padding-top: 1.25rem;
        border-top: 1px solid #d4d4d8;
      }
      [data-editorial-article] .prose img { border-radius: 0; }
      [data-editorial-article] .prose blockquote {
        border-left-color: #fbbf24;
        background: #fef3c7;
        color: #3f3f46;
        padding: 1rem 1.5rem;
        font-style: normal;
      }
      [data-editorial-article] .prose code:not(pre code) {
        background: #f4f4f5;
        color: #3f3f46;
      }
      [data-editorial-article] .prose hr { border-color: #d4d4d8; }
      [data-editorial-article] .prose table {
        border-color: #d4d4d8;
        background: #fafafa;
      }
      [data-editorial-article] .prose thead {
        border-color: #a1a1aa;
        background: #e4e4e7;
      }
      [data-editorial-article] .prose th { color: #18181b; }
      [data-editorial-article] .prose td {
        border-color: #e4e4e7;
        color: #3f3f46;
      }
      [data-editorial-article] .prose tbody tr:nth-child(odd) { background: #fafafa; }
      [data-editorial-article] .prose tbody tr:nth-child(even) { background: #f4f4f5; }
      [data-editorial-article] .prose tbody tr:hover { background: #fef3c7; }
      .dark [data-editorial-article] .prose {
        --tw-prose-body: #d4d4d8;
        --tw-prose-headings: #fafaf9;
        --tw-prose-lead: #e4e4e7;
        --tw-prose-links: #fbbf24;
        --tw-prose-bold: #fafaf9;
        --tw-prose-counters: #a1a1aa;
        --tw-prose-bullets: #71717a;
        --tw-prose-hr: #3f3f46;
        --tw-prose-quotes: #e4e4e7;
        --tw-prose-quote-borders: #fbbf24;
        --tw-prose-captions: #a1a1aa;
        --tw-prose-code: #fde68a;
        --tw-prose-pre-code: #e4e4e7;
        --tw-prose-pre-bg: #18181b;
        --tw-prose-th-borders: #52525b;
        --tw-prose-td-borders: #3f3f46;
        color: #d4d4d8;
      }
      .dark [data-editorial-article] .prose h1,
      .dark [data-editorial-article] .prose h2,
      .dark [data-editorial-article] .prose h3,
      .dark [data-editorial-article] .prose h4,
      .dark [data-editorial-article] .prose h5,
      .dark [data-editorial-article] .prose h6,
      .dark [data-editorial-article] .prose strong { color: #fafaf9; }
      .dark [data-editorial-article] .prose a { color: #fbbf24; }
      .dark [data-editorial-article] .prose h1 a,
      .dark [data-editorial-article] .prose h2 a,
      .dark [data-editorial-article] .prose h3 a,
      .dark [data-editorial-article] .prose h4 a,
      .dark [data-editorial-article] .prose h5 a,
      .dark [data-editorial-article] .prose h6 a { color: inherit; }
      .dark [data-editorial-article] .prose h2 { border-top-color: #3f3f46; }
      .dark [data-editorial-article] .prose blockquote {
        background: #422006;
        color: #fef3c7;
      }
      .dark [data-editorial-article] .prose code:not(pre code) {
        background: #27272a;
        color: #fde68a;
      }
      .dark [data-editorial-article] .prose hr { border-color: #3f3f46; }
      .dark [data-editorial-article] .prose table {
        border-color: #3f3f46;
        background: #18181b;
      }
      .dark [data-editorial-article] .prose thead {
        border-color: #52525b;
        background: #27272a;
      }
      .dark [data-editorial-article] .prose th { color: #fafaf9; }
      .dark [data-editorial-article] .prose td {
        border-color: #3f3f46;
        color: #d4d4d8;
      }
      .dark [data-editorial-article] .prose tbody tr:nth-child(odd) { background: #18181b; }
      .dark [data-editorial-article] .prose tbody tr:nth-child(even) { background: #27272a; }
      .dark [data-editorial-article] .prose tbody tr:hover { background: #422006; }
    `}</style>

    <div
      data-editorial-article
      className="mx-auto max-w-[96rem] px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-14"
    >
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-xs font-bold tracking-wider uppercase underline-offset-4 hover:underline"
      >
        <span aria-hidden="true" className="mr-2">
          ←
        </span>{" "}
        Index로 돌아가기
      </Link>

      <header className="mt-6 grid gap-8 border-y-2 border-current py-8 lg:grid-cols-12 lg:py-12">
        <div className="lg:col-span-9">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.15em] uppercase">
            {meta.category ? (
              <Link
                href={`/categories/${encodeURIComponent(meta.category)}`}
                className="underline-offset-4 hover:underline"
              >
                {meta.category}
              </Link>
            ) : null}
            {seriesEntry ? (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/series/${encodeURIComponent(seriesEntry.id)}`}
                  className="underline-offset-4 hover:underline"
                >
                  {seriesEntry.title}
                </Link>
              </>
            ) : null}
          </div>
          <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
            {meta.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
            {meta.description}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-6 border-current lg:col-span-3 lg:border-l lg:pl-8">
          <div>
            <dt className="text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase">
              Published
            </dt>
            <dd className="mt-2 text-sm font-semibold">
              <time dateTime={meta.createdAt.toISOString()}>
                {meta.createdAt.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase">
              Reading
            </dt>
            <dd className="mt-2 text-sm font-semibold">{readingTime} min</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase">
              Filed under
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {meta.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="border-b border-current text-xs font-semibold"
                >
                  {tag}
                </Link>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      {headings.length > 0 ? (
        <details className="mt-8 border-y border-current py-3 lg:hidden">
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-bold">
            이 글의 목차
          </summary>
          <ol className="space-y-2 pb-3 text-sm text-zinc-600 dark:text-zinc-300">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? "pl-4" : undefined}
              >
                <Link href={`#${heading.id}`}>{heading.text}</Link>
              </li>
            ))}
          </ol>
        </details>
      ) : null}

      <div className="grid justify-center gap-10 py-10 lg:grid-cols-[11rem_minmax(0,46rem)_12rem] lg:gap-12 lg:py-16">
        <aside className="hidden lg:block">
          <nav
            aria-label="Table of contents"
            className="sticky top-24 border-t-2 border-current pt-4"
          >
            <p className="mb-4 text-xs font-black tracking-wider uppercase">
              On this page
            </p>
            <ol className="space-y-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={heading.level === 3 ? "pl-3" : undefined}
                >
                  <Link
                    href={`#${heading.id}`}
                    className="block border-l border-transparent pl-2 hover:border-current hover:text-current"
                  >
                    {heading.text}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 overflow-x-auto">
          <Prose>{content}</Prose>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8 border-t-2 border-current pt-4">
            <div>
              <p className="text-xs font-black tracking-wider uppercase">
                Share / Ask
              </p>
              <div className="mt-3 [&>div]:flex-wrap [&_button]:size-10">
                <ShareButton url={`${siteUrl}/${slug}`} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="border-t-2 border-current py-10 sm:py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase">
              Continue reading
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              이 주제를 더 읽는다면
            </h2>
          </div>
          <Link
            href="/posts"
            className="hidden text-sm font-bold underline underline-offset-4 sm:block"
          >
            전체 글
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden border border-current bg-current md:grid-cols-3">
          {relatedPosts.slice(0, 3).map((post, index) => (
            <Link
              key={post.slug}
              href={articleHref(post.slug)}
              className="group flex min-h-60 flex-col justify-between bg-stone-50 p-6 transition-colors duration-200 hover:bg-amber-200 dark:bg-zinc-950 dark:hover:bg-amber-300 dark:hover:text-zinc-950"
            >
              <span className="font-mono text-xs">
                0{index + 1} / {post.meta.category}
              </span>
              <span>
                <h3 className="text-xl font-bold leading-7 group-hover:underline group-hover:underline-offset-4">
                  {post.meta.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-65">
                  {post.meta.description}
                </p>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  </>
);
