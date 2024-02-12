import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import TrackingTools from '@/src/components/common/TrackingTools';
import Footer from '@/src/components/ui/Footer';
import Header from '@/src/components/ui/Header';
import { ILayoutProps } from '@/src/interfaces';
import { cls } from '@/src/libs/utils';

import '@/src/styles/globals.css';

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

export const metadata: Metadata = {
  title: 'HyoungMin',
  description: 'Tech Blog by HyoungMin',
};

const RootLayout = ({ children }: ILayoutProps) => {
  return (
    <html lang='ko'>
      <TrackingTools />
      <body
        className={cls(
          Pretendard.className,
          'relative bg-secondary-500 text-primary-50 w-screen flex flex-col min-h-screen overflow-x-hidden',
        )}
      >
        <Header />
        <main role='main' className='flex flex-col flex-1 gap-4 tablet:gap-10'>
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
