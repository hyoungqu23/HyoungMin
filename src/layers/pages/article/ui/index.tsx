import type { TArticlePreview } from '@entities';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface IArticlePageProps {
  preview: TArticlePreview;
  content: string;
}

export const ArticlePage = ({ preview, content }: IArticlePageProps) => {
  return (
    <section className='flex flex-col px-4 pt-10 pb-40 text-heading6 w-full'>
      <header className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <p className='self-center font-semibold underline underline-offset-2'>
            {preview.category}
          </p>
          <p className='self-end text-body1 opacity-50'>
            {new Date(preview.createdAt).toLocaleDateString()}
          </p>
        </div>
        <h1 className='text-heading3 tablet:text-heading1 font-extrabold'>
          {preview.title}
        </h1>
        <ul className='flex gap-1 text-body2 flex-wrap text-primary-200/50'>
          {preview.tags.map((tag) => (
            <span
              key={tag}
              className='after:content-["|"] after:ml-1 last:after:content-none last:after:ml-0'
            >
              {tag}
            </span>
          ))}
        </ul>
      </header>
      <div className='w-full h-0.5 bg-secondary-400 my-4' />
      <article className='prose max-w-[1024px] prose-primary w-full py-10'>
        <MDXRemote source={content} />
      </article>
    </section>
  );
};
