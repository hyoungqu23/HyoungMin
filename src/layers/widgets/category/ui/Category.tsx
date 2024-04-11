'use client';

import { NAVIGATION_ITEMS, cls } from '@shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isInCategory } from '../lib';

interface ICategoryProps {
  category: string;
}

export const Category = ({ category }: ICategoryProps) => {
  const pathname = usePathname();

  return (
    <li
      className={cls(
        'w-fit h-full flex items-center justify-center px-1 py-0.5 tablet:px-4 tablet:py-3 rounded-md',
        isInCategory(pathname, category.toLowerCase())
          ? 'border-2 border-white'
          : 'opacity-50',
      )}
    >
      <Link
        href={`${NAVIGATION_ITEMS.ARTICLES.route}/${
          NAVIGATION_ITEMS.CATEGORY.route
        }/${category.toLowerCase()}`}
      >
        {category}
      </Link>
    </li>
  );
};
