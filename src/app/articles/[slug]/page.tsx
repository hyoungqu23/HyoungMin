import { allArticles } from '@contentlayer';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getRandomColor } from '@/src/libs/utils';

interface IArticlePageProps {
  params: { slug: string };
}

const ArticlePage = ({ params: { slug } }: IArticlePageProps) => {
  const article = allArticles.find((article) => article.slugAsParams === slug);

  if (!article) notFound();

  const MDXContent = useMDXComponent(article.body.code);

  return (
    <section className='flex flex-col px-4 pt-10 pb-40 items-center'>
      <>
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            width={400}
            height={300}
            className='object-contain'
          />
        ) : null}
      </>
      <h1 className='text-display2 font-extrabold'>{article.title}</h1>
      <p>{article.description}</p>
      <p>{new Date(article.createdAt).toLocaleDateString()}</p>
      <p>{article.category}</p>

      <ul className='flex gap-1'>
        {article.tags.map((tag) => (
          <span key={tag} style={{ color: getRandomColor() }}>
            {tag}
          </span>
        ))}
      </ul>
      <div className='w-full h-0.5 bg-primary-500 my-4' />
      <article className='prose prose-primary max-w-3xl'>
        <MDXContent />
      </article>
    </section>
  );
};

export default ArticlePage;

export const generateStaticParams = async () => {
  return allArticles.map((article) => {
    return {
      slug: article._raw.flattenedPath,
    };
  });
};
