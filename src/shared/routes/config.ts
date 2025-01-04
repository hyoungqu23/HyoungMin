export const BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://hyoungmin.vercel.app' : 'http://localhost:3000';

export const NAVIGATION_ITEMS = {
  HOME: { id: 'home', route: '/' },
  ARTICLES: { id: 'articles', route: '/articles' },
  CATEGORY: { id: 'category', route: '/about' },
};
