import type { Route } from "next";
import Link from "next/link";

import {
  formatCompactDate,
  formatLongDate,
  type EditorialData,
} from "../_lib/editorial-utils";

const prototypeArticleHref = (slug: string) => `/${slug}` as Route;

export const EditorialHome = ({ data }: { data: EditorialData }) => {
  const [leadPost, ...recentPosts] = data.latestPosts;

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-stone-50">
      <div className="mx-auto max-w-[96rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <header className="border-y-2 border-current py-6">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.22em] uppercase">
              Editorial Index
            </p>
            <h1 className="max-w-5xl text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              <span className="block">기술보다 먼저,</span>
              <span className="block">판단의 맥락을 기록합니다.</span>
            </h1>
          </div>
        </header>

        {leadPost ? (
          <section
            id="latest"
            className="scroll-mt-24 grid border-b border-current lg:grid-cols-12"
          >
            <article className="border-current py-10 lg:col-span-8 lg:border-r lg:pr-12 lg:py-16">
              <div className="mb-8 flex items-center justify-between gap-4 text-xs font-semibold tracking-wider uppercase">
                <span>{leadPost.meta.category || "Latest"}</span>
                <time dateTime={leadPost.meta.createdAt.toISOString()}>
                  {formatLongDate(leadPost.meta.createdAt)}
                </time>
              </div>
              <Link
                href={prototypeArticleHref(leadPost.slug)}
                className="group block"
              >
                <h2 className="max-w-4xl text-4xl font-bold tracking-[-0.04em] text-balance decoration-2 underline-offset-8 group-hover:underline sm:text-5xl lg:text-6xl">
                  {leadPost.meta.title}
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                  {leadPost.meta.description}
                </p>
                <span className="mt-8 inline-flex min-h-11 items-center border-b-2 border-current text-sm font-bold">
                  글 읽기{" "}
                  <span aria-hidden="true" className="ml-2">
                    ↗
                  </span>
                </span>
              </Link>
            </article>

            <aside className="py-10 lg:col-span-4 lg:pl-8 lg:py-16">
              <div className="flex items-baseline justify-between border-b border-current pb-3">
                <h2 className="text-lg font-bold">Recent notes</h2>
                <Link
                  href="/posts"
                  className="text-xs underline underline-offset-4"
                >
                  전체 보기
                </Link>
              </div>
              <ol>
                {recentPosts.slice(0, 5).map((post, index) => (
                  <li
                    key={post.slug}
                    className="border-b border-zinc-300 py-5 dark:border-zinc-700"
                  >
                    <Link
                      href={prototypeArticleHref(post.slug)}
                      className="group grid grid-cols-[2rem_1fr] gap-3"
                    >
                      <span className="font-mono text-xs text-zinc-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block font-semibold leading-6 group-hover:underline group-hover:underline-offset-4">
                          {post.meta.title}
                        </span>
                        <span className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{post.meta.category}</span>
                          <time dateTime={post.meta.createdAt.toISOString()}>
                            {formatCompactDate(post.meta.createdAt)}
                          </time>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </section>
        ) : null}

        <section
          id="series"
          className="scroll-mt-24 grid gap-10 border-b-2 border-current py-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-[0.2em] uppercase">
              Long reads
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Series</h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-current bg-current sm:grid-cols-3 lg:col-span-9">
            {data.topSeries.map((series, index) => (
              <Link
                key={series.id}
                href={`/series/${encodeURIComponent(series.id)}`}
                className="group flex min-h-64 flex-col justify-between bg-stone-50 p-6 transition-colors duration-200 hover:bg-amber-200 dark:bg-zinc-950 dark:hover:bg-amber-300 dark:hover:text-zinc-950"
              >
                <span className="font-mono text-xs">
                  0{index + 1} / {series.count}
                </span>
                <span>
                  <h3 className="text-2xl font-bold tracking-tight group-hover:underline group-hover:underline-offset-4">
                    {series.title}
                  </h3>
                  {series.description ? (
                    <p className="mt-3 text-sm leading-6 opacity-70">
                      {series.description}
                    </p>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="grid gap-8 py-10 sm:grid-cols-[1fr_3fr]">
          <h2 className="text-sm font-bold tracking-wider uppercase">
            Browse by topic
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {data.topCategories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="inline-flex min-h-11 items-center gap-2 text-lg font-semibold underline decoration-zinc-300 underline-offset-4 hover:decoration-current dark:decoration-zinc-700"
              >
                {category.name}
                <sup className="text-xs text-zinc-500">{category.count}</sup>
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};
