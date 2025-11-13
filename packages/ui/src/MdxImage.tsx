import Image from 'next/image';

export const MdxImage = (props: any) => {
  const { src, alt = '', ...rest } = props;
  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      sizes='100vw'
      style={{ width: '100%', height: 'auto' }}
      {...rest}
    />
  );
};
