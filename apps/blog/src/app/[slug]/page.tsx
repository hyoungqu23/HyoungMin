import { compilePostMDX } from '@/shared/lib/mdx';
import { mdxComponents } from '@/shared/lib/mdx-components';
import { readArticle, listSlugs } from '@/shared/lib/fs';
import { Prose } from '@hyoungmin/ui';
import { notFound } from 'next/navigation';

export const generateStaticParams = async () => {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
};

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  let source: string;
  try {
    source = await readArticle(slug);
  } catch {
    notFound();
  }

  const { content, meta } = await compilePostMDX(source, mdxComponents);

  return (
    <Prose>
      <h1>{meta.title}</h1>
      <p>{meta.summary}</p>
      {content}
    </Prose>
  );
};

export default PostPage;

