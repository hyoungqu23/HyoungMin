import GrayMatter from 'gray-matter';

export type TLayoutProps = {
  children: React.ReactNode;
};

export type TBaseErrorProps = {
  error: Error;
  reset: () => void;
};

export type TMetadata = {
  title: string;
  createdAt: string;
  category: string;
  tags: Array<string>;
  thumbnail: string;
};

declare module 'gray-matter' {
  function matter<
    D,
    I extends Input,
    O extends GrayMatter.GrayMatterOption<I, O>,
  >(input: I | { content: I }, options?: O): GrayMatter.GrayMatterFile<D, I>;

  interface GrayMatterFile<D, I extends Input> {
    data: D;
    content: string;
    excerpt?: string;
    orig: Buffer | I;
    language: string;
    matter: string;
    stringify(lang: string): string;
  }
}
