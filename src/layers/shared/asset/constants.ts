export const BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://hyoungmin.vercel.app' : 'http://localhost:3000';

export const NAVIGATION_ITEMS = {
  HOME: { id: 'home', route: '/' },
  ARTICLES: { id: 'articles', route: '/articles' },
  CATEGORY: { id: 'category', route: '/about' },
};

export const INFORMATION = ['HyoungMin', 'Frontend Engineer'];

export const SKILLS = [
  'React',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'Flutter',
  'JavaScript',
  'Git',
  'GitHub',
];

export const LINKS = {
  GITHUB: { id: 'github', href: 'https://github.com/hyoungqu23' },
  INSTAGRAM: { id: 'instagram', href: 'https://www.instagram.com/hyoungqu23/' },
  LINKEDIN: {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/hyoungmin2',
  },
  GMAIL: { id: 'gmail', href: 'hyoungqu23@gmail.com' },
  CAREERLY: {
    id: 'careerly',
    href: 'https://careerly.co.kr/profiles/147137',
  },
  PORTFOLIO: { id: 'portfolio', href: 'https://hyoungmin.vercel.app/' },
  KAKAO_TALK_OPEN_CHAT: {
    id: 'kakao open chat',
    href: 'https://open.kakao.com/o/szcSNlHe',
  },
};

export const COPYRIGHT = `© Copyright ${new Date().getFullYear()} HyoungMin. All rights reserved.`;

export const CONTENTS_PATH_MAP = {
  ROOT: 'contents',
  ARTICLES: 'articles',
};
