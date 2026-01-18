import type { Metadata } from "next";
import { Suspense } from "react";
import { getHeartCount } from "./_actions/hearts";
import { FloatingButton } from "./_components/floating/FloatingButton";
import { HeartButton } from "./_components/floating/HeartButton";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
  title: "🎀 형민 ❤️ 희재 결혼식 초대장 🎀",
  description: "형민이와 희재의 결혼식에 초대합니다.",
  openGraph: {
    title: "🎀 형민 ❤️ 희재 결혼식 초대장 🎀",
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

const InvitationLayout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* <Splash /> */}
      {children}
      <FloatingButton />
      <Suspense fallback={null}>
        <HeartButton initialCountPromise={getHeartCount()} />
      </Suspense>
    </>
  );
};

export default InvitationLayout;
