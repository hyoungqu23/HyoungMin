import { EXTERNAL_LINKS } from '@shared/config';
import { cls } from '@shared/lib';
import { BASE_URL } from '@shared/routes';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Footer, Header, Trackers } from '@widgets/layout';
import localFont from 'next/font/local';

import './globals.css';

export const generateMetadata = () => {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: '%s | HyoungMin',
      default: 'Home',
    },
    description: 'Tech Blog By Frontend Engineer HyoungMin',
    keywords:
      'Next.js, React, Git, GitHub, React-Three-Fiber, R3F, Three.js, React-Hook-Form, App Router, Page Router, Firebase, Supabase, Frontend, Engineer, Backend, Fullstack, I18N, Internationalization, L11N, Localization, Route Handler, 프론트엔드, 리액트, 넥스트, 개발자, 개발자 블로그, 개발 블로그, 테크 블로그, 이형민, 개발자 이형민, 프론트엔드 이형민, 프론트엔드 개발자 이형민',
    authors: [{ name: 'HyoungMin', url: EXTERNAL_LINKS.GITHUB.href }],
    alternates: {
      canonical: new URL(BASE_URL),
    },
    generator: 'Next.js',
    referrer: 'strict-origin-when-cross-origin',
    creator: 'HyoungMin',
    publisher: 'Vercel',
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: 'HyoungMin Tech Blog',
      description: 'Tech Blog By Frontend Engineer HyoungMin',
      images: [
        {
          url: '/images/web/hero_background.png',
          width: 1200,
          height: 630,
        },
      ],
      siteName: 'HyoungMin Tech Blog',
      locale: 'ko',
      type: 'website',
      url: new URL(BASE_URL),
    },
    twitter: {
      title: 'HyoungMin Tech Blog',
      description: 'Tech Blog By Frontend Engineer HyoungMin',
      url: new URL(BASE_URL),
      images: {
        url: '/images/web/hero_background.png',
        alt: 'Thumbnail',
      },
    },
    verification: {
      google: 'bifggwBk-paprwdgYduW7jTkn7lspxQAmuz2eQOq4Hg',
    },
  };
};

export type TRootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: TRootLayoutProps) => {
  return (
    <html lang='ko'>
      <Trackers />
      <body
        className={cls(
          Pretendard.className,
          'relative bg-secondary-500 text-primary-50 w-screen flex flex-col items-center min-h-screen overflow-x-hidden',
        )}
      >
        <Header />
        <main role='main' className='max-w-[1024px] flex-1 w-full'>
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;

const Pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Black.subset.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-ExtraBold.subset.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Light.subset.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-ExtraLight.subset.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Thin.subset.woff2',
      weight: '100',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--pretendard',
});
