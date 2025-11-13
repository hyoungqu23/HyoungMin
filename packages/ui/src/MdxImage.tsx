import Image from 'next/image';
import type { ComponentProps } from 'react';

type ImageProps = ComponentProps<'img'>;

export const MdxImage = (props: ImageProps) => {
  const { src, alt, width, height, ...rest } = props;
  
  if (!src || typeof src !== 'string') {
    return null;
  }

  const imageAlt = typeof alt === 'string' ? alt : '';
  
  const imageWidth = typeof width === 'number' ? width : 1600;
  const imageHeight = typeof height === 'number' ? height : 900;

  return (
    <Image
      src={src}
      alt={imageAlt}
      width={imageWidth}
      height={imageHeight}
      sizes='100vw'
      style={{ width: '100%', height: 'auto' }}
    />
  );
};
