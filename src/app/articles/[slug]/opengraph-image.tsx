import { allArticles } from '@contentlayer';
import { ImageResponse } from 'next/og';

export const alt = 'HyoungMin Tech Blog Article';
export const size = {
  width: 600,
  height: 315,
};
export const contentType = 'image/png';

interface IOpenGraphImageProps {
  params: { slug: string };
}

const Image = async ({ params: { slug } }: IOpenGraphImageProps) => {
  const article = allArticles.find((article) => article.slugAsParams === slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {article?.title ?? 'HyoungMin Tech Blog'}
      </div>
    ),
    {
      ...size,
    },
  );
};

export default Image;

export const runtime = 'edge';
