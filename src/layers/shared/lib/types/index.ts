import GrayMatter from 'gray-matter';

export type TLayoutProps = {
  children: React.ReactNode;
};

export type TBaseErrorProps = {
  error: Error;
  reset: () => void;
};

export type TImageProps = {
  src: string;
  alt: string;
};

export type TMetadata = {
  title: string;
  createdAt: string;
  category: string;
  tags: Array<string>;
  thumbnail: string;
};
