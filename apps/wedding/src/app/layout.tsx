import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "./_components/analytics/Analytics";
import { FloatingButton } from "./_components/floating/FloatingButton";
import { Kakao } from "./_components/root/Kakao";
import { Splash } from "./_components/splash/Splash";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
  title: "이형민 ♥ 임희재 결혼식",
  description: "형민이와 희재의 결혼식에 초대합니다.",
  openGraph: {
    title: "이형민 ♥ 임희재 결혼식",
    description: "형민이와 희재의 결혼식에 초대합니다.",
    images: [
      {
        url: "/images/sample.jpg",
        width: 1200,
        height: 630,
        alt: "이형민 ♥ 임희재 결혼식",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "이형민 ♥ 임희재 결혼식",
    description: "형민이와 희재의 결혼식에 초대합니다.",
    images: [
      {
        url: "/images/sample.jpg",
        width: 1200,
        height: 630,
        alt: "이형민 ♥ 임희재 결혼식",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang="ko">
      <body className={`${pretendardFont.variable} antialiased bg-rose-50`}>
        <Kakao />
        <Analytics />
        <Splash />
        {children}
        <FloatingButton />
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
