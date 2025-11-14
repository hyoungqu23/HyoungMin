import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

import KeyboardShortcutsProvider from "@/features/keyboard-shortcuts/KeyboardShortcutsProvider";
import "@/root/styles/globals.css";
import { Analytics } from "@/root/analytics/ui/Anayltics";
import Footer from "@/widgets/footer/Footer";
import Header from "@/widgets/header/Header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const siteName = "Blog";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "Blog built with Next.js",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName,
    title: siteName,
    description: "Blog built with Next.js",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Blog built with Next.js",
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: `${siteUrl}/feed.xml`, title: `${siteName} RSS Feed` },
      ],
    },
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendardFont.variable}>
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <KeyboardShortcutsProvider>
            <Header />
            {/* 헤더 높이만큼 패딩 추가 (h-16 = 64px) */}
            <div className="pt-16 min-h-[calc(100vh-64px)] flex flex-col">
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </KeyboardShortcutsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

const pretendardFont = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-Black.subset.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-ExtraBold.subset.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-SemiBold.subset.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Light.subset.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-ExtraLight.subset.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Thin.subset.woff2",
      weight: "100",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--pretendard",
});
