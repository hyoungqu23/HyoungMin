import type { Metadata } from "next";
import { Analytics } from "./_components/Analytics";
import { FloatingButton } from "./_components/FloatingButton";
import { Splash } from "./_components/Splash";
import "./globals.css";

export const metadata: Metadata = {
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
  // verification: {},
};

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang="ko">
      <body className="antialiased bg-rose-50">
        <Analytics />
        <Splash />
        {children}
        <FloatingButton />
      </body>
    </html>
  );
};

export default RootLayout;
