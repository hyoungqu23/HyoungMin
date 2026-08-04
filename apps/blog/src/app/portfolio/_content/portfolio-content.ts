import { EXTERNAL_LINKS } from "@/shared/config/external-links";

export const HERO = {
  eyebrow: "Frontend Developer → Product Engineer",
  titleLines: ["PRODUCT", "ENGINEER"] as const,
  titleLabel: "PRODUCT ENGINEER",
  intro: {
    main: {
      before: "문제를 ",
      strongA: "데이터로 확인하고",
      middle: ", 같은 문제가 반복되지 않도록 ",
      strongB: "프로세스와 아키텍처를 바꿉니다.",
    },
  },
  tags: ["Seoul, KR", "4th year"],
  sticker: ["4TH YEAR", "IN PRODUCT"],
} as const;

export const MARQUEE_ITEMS = [
  "Frontend",
  "Product",
  "Systems",
  "Automation",
] as const;

export const IMPACT = {
  index: "01 / Impact",
  before: "20.1",
  after: "0.7",
  unit: "s",
  ariaLabel: "대시보드 p75 FCP 20.1초에서 0.7초로 개선",
  label: "CPR Cloud / Performance",
  description:
    "실시간 집계를 사전 집계 구조로 전환해 데이터베이스 부하를 줄이고, 대시보드 p75 FCP를 96.5% 개선했습니다.",
} as const;

export const STATS = {
  index: "02 / How I create leverage",
  titleLines: ["Small code.", "Big change."],
  items: [
    {
      value: 99,
      suffix: "%",
      copy: "Google Sheets에서 TypeScript 모듈까지 연결해 다국어 적용 수작업을 없앴습니다.",
      tone: "acid",
      href: "/internationalization-with-automatic-system",
    },
    {
      value: 16,
      suffix: "BUGS",
      copy: "758개 파일을 strict 모드로 전환하며 프로덕션에 살아 있던 버그를 발견하고 수정했습니다.",
      tone: "cyan",
      href: undefined,
    },
    {
      value: 75,
      suffix: "%",
      copy: "반응형 규칙을 코드로 자동화해 디자인 QA 리드 타임을 단축했습니다.",
      tone: "pink",
      href: undefined,
    },
  ],
} as const;

export const EXPERIENCE = {
  index: "03 / Experience",
  titleLines: ["Built across", "the product."],
  rows: [
    {
      period: "2026.03 — NOW",
      company: "Aents",
      role: "Software Engineer",
      copy: "기업의 탄소 배출량을 측정하고 관리하는 웹서비스 Aentscope를 개발합니다. 복잡한 도메인 기능을 제품에 녹이고, 대규모 코드베이스의 안정성을 높이는 일을 주도했습니다.",
    },
    {
      period: "2022.11 — 2026.02",
      company: "IMLAB",
      role: "Software Engineer",
      copy: "CPR Cloud, 기업 홈페이지, 백오피스와 사내 도구를 만들었습니다. 성능과 전환율을 데이터로 추적하고, 반복되는 업무를 제품과 자동화 도구로 바꿨습니다.",
    },
  ],
} as const;

export const WORK = {
  index: "04 / Selected Work",
  titleLines: ["Problems,", "then systems."],
  intro:
    "프로젝트를 기능 목록으로 설명하지 않습니다. 어떤 문제가 있었고, 그 문제가 다시 생기지 않도록 무엇을 바꿨는지를 남깁니다.",
  projects: [
    {
      meta: "2026 / AENTSCOPE",
      number: "01",
      kicker: "Carbon accounting platform",
      title: "탄소 데이터를 수집하는 복잡한 흐름을 제품으로 정리하다.",
      description:
        "TypeScript strict 전환과 UI 라이브러리 정리로 다음 변경이 안전한 기반을 만들었습니다.",
      tags: ["Next.js 15", "React 19", "TypeScript", "MUI"],
      tone: "surface",
      href: undefined,
    },
    {
      meta: "2024—2025 / CPR CLOUD",
      number: "02",
      kicker: "Remote product management",
      title: "느린 화면을 고치는 대신, 느릴 수밖에 없는 구조를 바꾸다.",
      description:
        "실시간 집계를 사전 집계 아키텍처로 전환해 대시보드 p75 FCP를 20.1초에서 0.7초로 단축했습니다.",
      tags: ["Next.js", "PostgreSQL", "BigQuery", "Supabase"],
      tone: "acid",
      href: "/performance-optimization",
    },
    {
      meta: "2025 / INTERNAL SDK",
      number: "03",
      kicker: "Workflow automation",
      title: "사람이 반복하던 일을 타입 안전한 파이프라인으로 바꾸다.",
      description:
        "기획 문서부터 다국어 모듈 생성까지 자동화하고, 런타임 데이터 검증과 이벤트 로깅 체계를 SDK로 표준화했습니다.",
      tags: ["Node.js", "Zod", "Firebase", "Turborepo"],
      tone: "red",
      href: undefined,
    },
    {
      meta: "2024—2025 / IMLAB WEB",
      number: "04",
      kicker: "Growth through performance",
      title: "성능 지표를 비즈니스 지표의 변화까지 연결하다.",
      description:
        "LCP를 3.3초에서 1초 이내로 줄여 이탈률을 17.29%p 낮추고, 기술적 SEO 개선으로 Organic 유입을 66.87% 높였습니다.",
      tags: ["Next.js", "SSG", "JSON-LD", "BigQuery"],
      tone: "pink",
      href: "/search-engine-optimization-guide",
    },
  ],
} as const;

export const CONTACT = {
  titleHtmlLines: ["LET'S BUILD", "WHAT LASTS."],
  emphasis: "LASTS.",
  copy: "빠르게 만드는 것과 오래 버티는 구조 사이에서 답을 찾습니다. 제품의 문제를 함께 발견하고, 측정 가능한 변화로 만들 팀을 기다리고 있습니다.",
  links: [
    { id: "Email", href: EXTERNAL_LINKS.GMAIL.href, external: true },
    { id: "GitHub", href: EXTERNAL_LINKS.GITHUB.href, external: true },
    { id: "LinkedIn", href: EXTERNAL_LINKS.LINKEDIN.href, external: true },
    { id: "Blog", href: "/", external: false },
  ],
  footer: {
    copyright: "© 2026 HYOUNGMIN LEE",
    slogan: "DESIGNED TO EXPLAIN, ANIMATED TO REMEMBER.",
  },
} as const;
