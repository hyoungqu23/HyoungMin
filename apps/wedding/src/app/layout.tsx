import type { Metadata } from "next";
import { Great_Vibes, Hahmlet, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "./(invitation)/_components/analytics/Analytics";
import { Kakao } from "./(invitation)/_components/root/Kakao";
import "./globals.css";

const METADATA_BASE_URL =
  process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(METADATA_BASE_URL),
  title: "🎀 형민 ❤️ 희재 결혼식 초대장 🎀",
  description: "형민이와 희재의 결혼식에 초대합니다.",
  openGraph: {
    title: "🎀 형민 ❤️ 희재 결혼식 초대장 🎀",
    description: "형민이와 희재의 결혼식에 초대합니다.",
    images: [
      {
        url: "/images/opengraph.webp",
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
        url: "/images/opengraph.webp",
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
      <body
        className={`relative ${pretendardFont.variable} ${greatVibesFont.variable} ${hahmletFont.variable} ${playfairDisplayFont.variable} antialiased bg-black overflow-x-hidden`}
      >
        <Kakao />
        <Analytics />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

const greatVibesFont = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--great-vibes",
});

const hahmletFont = Hahmlet({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  variable: "--hahmlet",
});

const playfairDisplayFont = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  variable: "--playfair-display",
});

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
