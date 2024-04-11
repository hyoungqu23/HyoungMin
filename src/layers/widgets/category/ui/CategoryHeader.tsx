import { Category } from './Category';

interface ICategoryHeaderProps {
  categories: Array<string>;
}

export const CategoryHeader = ({ categories }: ICategoryHeaderProps) => {
  return (
    <header className='w-full flex flex-wrap tablet:flex-nowrap tablet:gap-4 list-none text-heading6 tablet:text-heading5 font-semibold'>
      {categories.map((category) => (
        <Category key={category} category={category} />
      ))}
    </header>
  );
};
