export type TArticlesLayoutProps = {
  children: React.ReactNode;
};

const ArticlesLayout = async ({ children }: TArticlesLayoutProps) => {
  return <section className='flex flex-col gap-10 tablet:gap-20 w-full px-4 py-10 tablet:py-20'>{children}</section>;
};

export default ArticlesLayout;
