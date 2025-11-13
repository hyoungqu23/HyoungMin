import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Header from '@/widgets/header/Header';
import '../root/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const siteName = 'Blog';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Blog built with Next.js',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName,
    title: siteName,
    description: 'Blog built with Next.js',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Blog built with Next.js',
  },
  alternates: {
    types: {
      'application/rss+xml': [{ url: `${siteUrl}/feed.xml`, title: `${siteName} RSS Feed` }],
    },
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Header />
          {/* 헤더 높이만큼 패딩 추가 (h-16 = 64px) */}
          <div className='pt-16'>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
