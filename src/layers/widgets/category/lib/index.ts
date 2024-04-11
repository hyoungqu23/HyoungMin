export const isInCategory = (pathname: string, category: string) =>
  pathname.toLowerCase().includes(category.replaceAll('.', ''));
