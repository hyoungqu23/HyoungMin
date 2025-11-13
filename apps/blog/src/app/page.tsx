import { listSlugs, readArticle } from '@/shared/lib/fs';
import { compilePostMDX } from '@/shared/lib/mdx';
import Link from 'next/link';

const Home = async () => {
  const slugs = await listSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readArticle(slug);
      const { meta } = await compilePostMDX(source, {});
      return { slug, meta };
    }),
  );

  const publishedPosts = posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-8'>Blog</h1>
      <ul className='space-y-4'>
        {publishedPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`} className='block hover:underline'>
              <h2 className='text-2xl font-semibold'>{post.meta.title}</h2>
              <p className='text-gray-600'>{post.meta.summary}</p>
              <time className='text-sm text-gray-500'>
                {post.meta.date.toLocaleDateString('ko-KR')}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
