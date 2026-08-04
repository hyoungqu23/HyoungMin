import type { Metadata } from "next";

import Contact from "./_components/Contact";
import Experience from "./_components/Experience";
import Hero from "./_components/Hero";
import Impact from "./_components/Impact";
import Marquee from "./_components/Marquee";
import PortfolioHeader from "./_components/PortfolioHeader";
import PortfolioMotion from "./_components/PortfolioMotion";
import Stats from "./_components/Stats";
import Work from "./_components/Work";

import { EXTERNAL_LINKS } from "@/shared/config/external-links";
import { siteUrl } from "@/shared/config/site";

const TITLE = "이형민 — Product Engineer";
const DESCRIPTION =
  "문제를 데이터로 확인하고 프로세스와 아키텍처를 바꿉니다. 대시보드 p75 FCP 20.1초→0.7초, 다국어 수작업 99% 자동화, 758개 파일 strict 전환.";
const OG_IMAGE = `${siteUrl}/images/og/portfolio.png`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: `${siteUrl}/portfolio`,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${siteUrl}/portfolio`,
    siteName: "Blog",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const PortfolioPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "이형민",
      alternateName: "Hyoungmin Lee",
      jobTitle: "Product Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Aents",
      },
      url: `${siteUrl}/portfolio`,
      sameAs: [
        EXTERNAL_LINKS.GITHUB.href,
        EXTERNAL_LINKS.LINKEDIN.href,
        siteUrl,
      ],
    },
  };

  return (
    <>
      {/* next/script beforeInteractive는 RSC payload에만 실려 서버 HTML에
          <script> 태그가 없다 — JS 없는 크롤러를 위해 인라인으로 렌더 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioMotion>
        <a href="#main" className="pf-skip-link">
          본문으로 건너뛰기
        </a>
        <div className="pf-progress" aria-hidden="true" />
        <PortfolioHeader />
        <main id="main" role="main">
          <Hero />
          <Marquee />
          <Impact />
          <Stats />
          <Experience />
          <Work />
          <Contact />
        </main>
      </PortfolioMotion>
    </>
  );
};

export default PortfolioPage;
