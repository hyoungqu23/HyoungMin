import { cn } from "@hyoungmin/ui";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";

import KeyboardShortcutsProvider from "@/features/keyboard-shortcuts/KeyboardShortcutsProvider";
import { Analytics } from "@/root/analytics/ui/Analytics";
import "@/root/styles/globals.css";
import { siteUrl } from "@/shared/config/site";
import Footer from "@/widgets/footer/Footer";
import Header from "@/widgets/header/Header";

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
    images: [
      {
        url: `${siteUrl}/images/logos/logo-background.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Blog built with Next.js",
    images: [`${siteUrl}/images/logos/logo-background.png`],
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: `${siteUrl}/feed.xml`, title: `${siteName} RSS Feed` },
      ],
    },
  },
  verification: {
    google: "bifggwBk-paprwdgYduW7jTkn7lspxQAmuz2eQOq4Hg",
    other: {
      "naver-site-verification": "ec8dfd4425db70a51815d51de08e2c27c3a002ba",
      "google-adsense-account": "ca-pub-2389668330704189",
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
      <body
        className={cn(pretendardFont.variable, "flex flex-col min-h-screen")}
      >
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <KeyboardShortcutsProvider>
            <Header />
            <main
              id="main"
              role="main"
              className="flex-1 flex flex-col items-center"
            >
              {children}
            </main>
            <Footer />
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
