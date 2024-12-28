import { NAVIGATION_ITEMS } from '@shared/index';

export const isInCategory = (pathname: string, category: string) =>
  pathname.includes(NAVIGATION_ITEMS.CATEGORY.route)
    ? pathname.toLowerCase().includes(category.replaceAll('.', ''))
    : false;
