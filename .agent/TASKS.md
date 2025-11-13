# 블로그 프로젝트 구축 태스크 목록 — 상세 버전

본 문서는 PRD.md 기반으로, 바로 실행 가능한 세부 태스크를 제공합니다.  
각 태스크는 **완료 기준(DoD)**, **검증(Verify)**, **주의사항(Pitfalls)**를 포함합니다.

---

## 0. 공통 규칙

- **패키지 범위**
  - 스코프: `@hyoungmin/*` (예: `@hyoungmin/ui`, `@hyoungmin/schema`, `@hyoungmin/eslint-config`)
- **경로 별칭(예)**
  - 앱: `@/` → `apps/blog/src/*`
  - 패키지: `@hyoungmin/ui`, `@hyoungmin/schema`, `@hyoungmin/typescript-config`
- **빌드·체크 관례**
  - 루트에서 `pnpm turbo run <task> --parallel`
- **코드 스타일**
  - ESLint + Prettier, 커밋 전 Husky/lint-staged(선택)로 강제

---

## 1) 모노레포 기본 구조

### 1.1 Turborepo 초기화

- **작업**
  - 루트에 `turbo.json` 생성:
    ```json
    {
      "$schema": "https://turbo.build/schema.json",
      "tasks": {
        "lint": { "outputs": [] },
        "typecheck": { "outputs": [] },
        "test": { "outputs": [] },
        "test:ci": { "outputs": [] },
        "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] }
      }
    }
    ```
- **DoD**: 루트 `pnpm turbo run lint` 실행 시 오류 없이 파이프라인 탐색됨.
- **Verify**

  ```bash
  pnpm dlx turbo -v
  pnpm turbo run lint --dry
  ```

- **Pitfalls**: outputs 경로는 패키지마다 다를 수 있음(Next `.next/**`, lib `dist/**` 등).

### 1.2 pnpm 워크스페이스 설정

- **작업**: `pnpm-workspace.yaml`

  ```yaml
  packages:
    - 'apps/*'
    - 'packages/*'
  ```

- **DoD**: `pnpm -w ls`에서 apps/packages가 워크스페이스로 보임.
- **Verify**

  ```bash
  pnpm -w ls
  ```

### 1.3 루트 package.json 설정

- **작업**
  - 워크스페이스 루트 초기화:

    ```bash
    pnpm init -y
    pnpm add -w -D turbo typescript eslint prettier vitest @vitest/coverage-v8 @types/node eslint-mdx
    pnpm add -w zod@^4
    ```

  - 스크립트(예):

    ```json
    {
      "scripts": {
        "lint": "pnpm turbo run lint --parallel",
        "typecheck": "pnpm turbo run typecheck --parallel",
        "test": "pnpm turbo run test --parallel",
        "test:ci": "pnpm turbo run test:ci --parallel",
        "build": "pnpm turbo run build --parallel"
      }
    }
    ```

- **DoD**: 루트에서 스크립트 실행 시 하위 워크스페이스로 전달됨.
- **Verify**

  ```bash
  pnpm run lint --parallel --filter=...
  ```

---

## 2) 공용 패키지

### 2.1 ESLint 설정 패키지 `@hyoungmin/eslint-config`

- **작업**
  - `packages/eslint-config/package.json`

    ```json
    { "name": "@hyoungmin/eslint-config", "version": "0.0.0", "main": "index.js" }
    ```

  - `packages/eslint-config/index.js`

    ```js
    module.exports = {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'next/core-web-vitals',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'unused-imports', 'import'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'warn',
        'unused-imports/no-unused-imports': 'warn',
        'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
        'no-console': ['warn', { allow: ['error', 'warn'] }],
      },
      overrides: [{ files: ['**/*.mdx'], parser: 'eslint-mdx' }],
    };
    ```

  - 루트 설치:

    ```bash
    pnpm -w add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin unused-imports eslint-plugin-import
    pnpm -w add -D eslint-mdx
    ```

- **DoD**: 앱/패키지의 package.json에 `"eslintConfig": {"extends":"@hyoungmin/eslint-config"}` 설정.
- **Verify**

  ```bash
  pnpm -C apps/blog run lint
  ```

### 2.2 Prettier 설정 패키지 `@hyoungmin/prettier-config`

- **작업**
  - `packages/prettier-config/package.json`

    ```json
    { "name": "@hyoungmin/prettier-config", "version": "0.0.0", "main": "index.cjs" }
    ```

  - `packages/prettier-config/index.cjs`

    ```cjs
    module.exports = {
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 100,
      tabWidth: 2,
      bracketSpacing: true,
      arrowParens: 'always',
    };
    ```

- **DoD**: 각 워크스페이스 `package.json`에 `"prettier":"@hyoungmin/prettier-config"`.
- **Verify**

  ```bash
  pnpm -w dlx prettier -v
  ```

### 2.3 TypeScript 설정 패키지 `@hyoungmin/typescript-config`

- **작업**
  - `packages/typescript-config/package.json`

    ```json
    {
      "name": "@hyoungmin/typescript-config",
      "version": "0.0.0",
      "exports": { "./base": "./base.json" }
    }
    ```

  - `packages/typescript-config/base.json`

    ```json
    {
      "compilerOptions": {
        "target": "ES2022",
        "lib": ["ES2022", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "jsx": "react-jsx",
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "types": ["vitest/globals"]
      }
    }
    ```

- **DoD**: 앱/패키지가 `extends: "@hyoungmin/typescript-config/base"` 사용.
- **Verify**

  ```bash
  pnpm -C apps/blog run typecheck
  ```

### 2.4 Schema 패키지 `@hyoungmin/schema`

- **작업**
  - `packages/schema/package.json`

    ```json
    { "name": "@hyoungmin/schema", "version": "0.0.0", "type": "module", "main": "src/index.ts" }
    ```

  - `packages/schema/src/index.ts`

    ```ts
    import { z } from 'zod';
    export const postMetaSchema = z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      summary: z.string().min(1),
      tags: z.array(z.string()).default([]),
      cover: z.string().optional(),
      draft: z.boolean().default(false),
    });
    export type PostMeta = z.infer<typeof postMetaSchema>;
    ```

- **DoD**: 앱에서 `import { postMetaSchema } from '@hyoungmin/schema'` 가능.
- **Verify**

  ```bash
  pnpm -C apps/blog run typecheck
  ```

### 2.5 UI 패키지 `@hyoungmin/ui`

- **작업**
  - `packages/ui/package.json`

    ```json
    { "name": "@hyoungmin/ui", "version": "0.0.0", "type": "module", "exports": "./src/index.ts" }
    ```

  - `packages/ui/tsconfig.json`

    ```json
    {
      "extends": "@hyoungmin/typescript-config/base",
      "compilerOptions": { "declaration": true, "outDir": "dist" },
      "include": ["src"]
    }
    ```

  - `packages/ui/src/CodeBlock.tsx`:
    - `useRef<HTMLPreElement>`로 pre 요소 참조
    - `preRef.current?.querySelector('code')?.innerText`로 텍스트 추출
    - shadcn Button으로 Copy 버튼 구현
    - 파일명은 `rehype-pretty-code`가 `data-rehype-pretty-code-title` 속성을 추가하면 CSS로 자동 표시됨
  - `packages/ui/src/MdxImage.tsx` (Next/Image 래퍼)
  - `packages/ui/src/Prose.tsx` (typography 래퍼)
  - `packages/ui/src/index.ts`

    ```ts
    export * from './CodeBlock';
    export * from './MdxImage';
    export * from './Prose';
    ```

- **DoD**: 앱에서 `import { CodeBlock } from '@hyoungmin/ui'` 동작.
- **Verify**

  ```bash
  pnpm -C apps/blog run dev
  ```

- **Pitfalls**: Next 앱이 외부 패키지 트랜스파일 필요 시 `transpilePackages` 사용.

---

## 3) 블로그 앱 설정

### 3.1 Next.js 앱 초기화

- **작업**
  - `apps/blog/package.json` 생성 및 설치:

    ```bash
    pnpm -C apps/blog init -y
    pnpm -C apps/blog add next@^16 react@^19 react-dom@^19
    pnpm -C apps/blog add next-mdx-remote remark-gfm rehype-pretty-code shiki
    pnpm -C apps/blog add tailwindcss@^4 @tailwindcss/typography
    pnpm -C apps/blog add -D autoprefixer postcss @testing-library/react @testing-library/jest-dom
    ```

  - 스크립트:

    ```json
    {
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "lint": "eslint . --ext .ts,.tsx,.mdx",
        "typecheck": "tsc -p tsconfig.json --noEmit",
        "test": "vitest",
        "test:ci": "vitest run --coverage"
      }
    }
    ```

- **DoD**: `pnpm -C apps/blog run dev`로 로컬 구동.
- **Pitfalls**: 외부 패키지 사용 시 next.config에 `transpilePackages`.

### 3.2 next.config.ts

- **작업**: `apps/blog/next.config.ts`

  ```ts
  import type { NextConfig } from 'next';
  const config: NextConfig = {
    experimental: { typedRoutes: true },
    transpilePackages: ['@hyoungmin/ui', '@hyoungmin/schema'],
    images: { remotePatterns: [{ protocol: 'https', hostname: '*' }] },
  };
  export default config;
  ```

- **DoD**: 외부 UI 패키지 import 시 빌드 성공.

### 3.3 Tailwind & PostCSS

- **작업**
  - `apps/blog/tailwind.config.ts`

    ```ts
    import type { Config } from 'tailwindcss';
    export default {
      content: [
        './src/**/*.{ts,tsx,mdx}',
        './contents/**/*.mdx',
        '../../packages/ui/src/**/*.{ts,tsx}',
      ],
      plugins: [require('@tailwindcss/typography')],
    } satisfies Config;
    ```

  - `apps/blog/postcss.config.js`

    ```js
    module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
    ```

- **DoD**: prose 클래스 적용 정상.
- **Pitfalls**: v4 플러그인 이슈 시 Tailwind v3로 롤백.

### 3.4 글로벌 스타일

- **작업**: `apps/blog/src/root/globals.css`
  - 라인 넘버 CSS (`code[data-line-numbers]`, `[data-line]::before`)
  - 라인/단어 하이라이트 CSS (`.highlighted`, `.word--highlighted`, `[data-highlighted-chars]`, `[data-highlighted-line]`)
  - 파일명 헤더 CSS (`pre[data-rehype-pretty-code-title]::before`, `pre[data-title]::before`)
- **DoD**: 코드블록에 라인 넘버/하이라이트/파일명/라인·단어 하이라이트 표시.

### 3.5 레이아웃

- **작업**: `apps/blog/src/app/layout.tsx`
  (lang="ko", `globals.css` import)
- **DoD**: 전역 스타일 적용.

---

## 4) MDX 처리 & 라우팅

### 4.1 MDX 컴파일 유틸

- **작업**: `apps/blog/src/shared/lib/mdx.ts`
  - `remark-gfm` + `rehype-pretty-code` 옵션:
    - `filterMetaString: (meta) => meta` (title/filename/meta 그대로 유지)
    - `onVisitLine`: 빈 줄 렌더 유지 (`node.children.length === 0` 처리)
    - `onVisitHighlightedLine`: `.highlighted` 클래스 추가
    - `onVisitHighlightedWord`: `.word--highlighted` 클래스 추가
  - `@hyoungmin/schema`로 frontmatter 검증

- **DoD**: 샘플 MDX에서 GFM/하이라이트/라인 넘버/파일명/라인·단어 하이라이트 렌더 성공.

### 4.2 (선택) 헤더 자동 앵커/목차

- **작업**

  ```bash
  pnpm -C apps/blog add rehype-slug rehype-autolink-headings
  ```

  - `rehypeSlug`, `[rehypeAutolinkHeadings, { behavior: 'wrap' }]` 추가

- **DoD**: H2/H3에 앵커가 생성되고 클릭 시 앵커 이동.
- **Pitfalls**: CSS로 앵커 아이콘/포커스 스타일 보완 필요.

### 4.3 FS 유틸 & 라우팅

- **작업**
  - `apps/blog/src/shared/lib/fs.ts`:
    - `listSlugs`: `contents/posts/*.mdx` 파일의 slug 목록 반환
    - `readArticle`: slug로 MDX 파일 읽기
  - `apps/blog/src/app/[slug]/page.tsx`: `generateStaticParams` + MDX 렌더
  - `apps/blog/src/app/page.tsx`: 목록(드래프트 제외, 날짜 내림차순)

- **DoD**: `/`에서 리스트, `/:slug`에서 본문 확인.

---

## 5) 테스트 & 품질

### 5.1 Vitest 스크립트 & (선택) 설정 파일

- **작업**
  - `apps/blog/vitest.config.ts` (선택)

    ```ts
    import { defineConfig } from 'vitest/config';
    export default defineConfig({
      test: { environment: 'jsdom', globals: true, coverage: { reporter: ['text', 'lcov'] } },
    });
    ```

- **DoD**: `pnpm -C apps/blog run test:ci` 성공.

### 5.2 기본 테스트

- **작업**: `apps/blog/src/shared/lib/__tests__/fs.test.ts`
  - `listSlugs`가 `.mdx` 파일 슬러그를 반환
  - `readArticle`가 내용 문자열을 반환

- **DoD**: 해당 테스트 green.

### 5.3 UI 테스트

- **작업**
  - `packages/ui/src/__tests__/CodeBlock.test.tsx`
    - 렌더링, Copy 클릭 → `navigator.clipboard.writeText` 호출
    - Copied! 피드백 표시

  - `packages/ui/src/__tests__/MdxImage.test.tsx`
    - Next/Image 래퍼 렌더 여부

- **DoD**: 두 테스트 모두 green.

### 5.4 Lint/Typecheck 스크립트

- **작업**: 모든 워크스페이스에 최소 스크립트 배치

  ```json
  {
    "scripts": {
      "lint": "eslint .",
      "typecheck": "tsc -p tsconfig.json --noEmit",
      "build": "echo no-op"
    }
  }
  ```

- **DoD**: 루트에서 turbo 파이프라인이 모든 워크스페이스에 적용.

---

## 6) CI/CD

### 6.1 CI (GitHub Actions)

- **작업**: `.github/workflows/ci.yml`
  - 루트에서 `pnpm install --frozen-lockfile`
  - `pnpm turbo run lint/typecheck/test:ci/build --parallel`
  - `concurrency`로 중복 취소

- **DoD**: PR·main push 시 CI green.

### 6.2 릴리즈 (Changesets)

- **작업**

  ```bash
  pnpm add -w -D @changesets/cli
  pnpm changeset init
  ```

  - `.changeset/config.json` 생성
  - `.github/workflows/release.yml` 구성(버전/릴리즈 PR/선택적 publish)

- **DoD**: changeset 생성→main 병합→릴리즈 PR 자동 생성 또는 publish.

### 6.3 배포 (Vercel)

- **권장**: Git Integration에서 Root Directory=`apps/blog`
  - Production Branch: `main`
  - Preview Branches: 모든 브랜치 활성화
  - Build Command: `cd ../.. && pnpm turbo run build --filter=blog`
- **선택**: `.github/workflows/deploy-vercel.yml` + `VERCEL_*` 시크릿
- **DoD**: PR → Preview URL, main → Production URL.
- **참고**: 상세 전략은 `.agent/DEPLOYMENT.md` 참조

---

## 7) 개발 생산성

### 7.1 (선택) Husky + lint-staged

- **작업**

  ```bash
  pnpm -w add -D husky lint-staged
  pnpm set-script prepare "husky install"
  pnpm prepare
  ```

  - `.husky/pre-commit`

    ```sh
    #!/usr/bin/env sh
    pnpm lint-staged
    ```

  - 루트 `package.json`

    ```json
    { "lint-staged": { "*.{ts,tsx,mdx}": ["eslint --fix", "prettier --write"] } }
    ```

- **DoD**: 커밋 시 자동 포맷/린트 수행.

---

## 8) 초기 콘텐츠

### 8.1 샘플 MDX

- **작업**: `apps/blog/contents/posts/sample.mdx`

  ````mdx
  ---
  title: '샘플 포스트'
  date: 2025-11-13
  summary: 'GFM/코드 하이라이트/이미지/컴포넌트 데모를 포함한 샘플'
  tags: ['mdx', 'demo']
  draft: false
  ---

  > 인용문 & 체크박스

  - [x] 할 일 1
  - [ ] 할 일 2

  ```tsx:app/page.tsx showLineNumbers {1,4-5}
  export default function Page() {
    return <div>Hello</div>;
  }
  ```

  | A   | B   |
  | --- | --- |
  | 1   | 2   |

  <img src='/some/local/image.png' alt='샘플 이미지' />

  {/_ (선택) 성능 데모 _/}
  {/_ <PerfDemoLoading label="RSC vs Client 로딩 비교" /> _/}

  ```

  ```
  ````

- **DoD**: 모든 요소 정상 렌더.

### 8.2 이미지 리모트 도메인(선택)

- **작업**: `next.config.ts` `images.remotePatterns` 설정
- **DoD**: 외부 이미지 로딩 정상.

---

## 9) (선택) features/perf-demo 컴포넌트 구축 — 설명 & 태스크

> **무엇?** MDX 본문에서 **실제 상호작용 성능 비교**를 체험하는 컴포넌트 묶음.

- **구성**
  1. `features/perf-demo/PerfDemoLoading.tsx`
     - 버튼 클릭 → `performance.now()` 측정 → UI에 ms 출력
     - 옵션: `simulatedDelayMs`로 지연값 조절

  2. `features/perf-demo/PerfDemoMotion.tsx`
     - before/after 토글 → framer-motion 적용 비교(선택)
     - 클릭 후 반응까지의 지연 체감 표시(간단한 timestamp 차이)

- **MDX 매핑**
  - `apps/blog/src/shared/lib/mdx-components.ts`

    ```ts
    import { CodeBlock, MdxImage, Prose } from '@hyoungmin/ui';
    import PerfDemoLoading from '@/features/perf-demo/PerfDemoLoading';
    import PerfDemoMotion from '@/features/perf-demo/PerfDemoMotion';

    export const mdxComponents = {
      pre: (p: any) => <CodeBlock {...p} />,
      img: (p: any) => <MdxImage {...p} />,
      PerfDemoLoading,
      PerfDemoMotion,
    } as const;
    ```

  - `compileMDX(..., { components: mdxComponents })`

- **DoD**
  - 샘플 MDX에서 두 컴포넌트 동작.
  - 버튼 클릭 시 수치가 갱신되고 콘솔 에러 없음.

- **주의**
  - 절대값은 환경 따라 달라짐 → “상대 비교” 목적임.

---

## 10) SEO 최적화 및 추가 기능

### 10.1 SEO 최적화 강화

- **작업**
  - `apps/blog/src/app/[slug]/page.tsx`: 동적 메타데이터 생성
    - `generateMetadata` 함수 구현
    - `title`, `description`, `keywords` (frontmatter 기반)
    - Open Graph 메타 태그 (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
    - Twitter Cards 메타 태그 (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
  - `apps/blog/src/app/[slug]/page.tsx`: JSON-LD 구조화 데이터
    - Article/BlogPosting 스키마 생성
    - `<script type="application/ld+json">` 태그로 삽입
  - `apps/blog/src/app/sitemap.ts`: Sitemap.xml 자동 생성
    - 모든 포스트 URL 포함
    - `lastModified`, `changeFrequency`, `priority` 설정
  - `apps/blog/src/app/robots.ts`: Robots.txt 생성
    - `User-agent: *`, `Allow: /`, `Sitemap: ${siteUrl}/sitemap.xml`

- **DoD**:
  - 각 포스트 페이지에 메타 태그, Open Graph, Twitter Cards 적용 확인.
  - JSON-LD 구조화 데이터 검증 (Google Rich Results Test).
  - `/sitemap.xml` 접근 가능.
  - `/robots.txt` 접근 가능.

- **Verify**

  ```bash
  # 개발 서버에서 확인
  curl http://localhost:3000/sitemap.xml
  curl http://localhost:3000/robots.txt
  ```

- **Pitfalls**: Open Graph 이미지는 절대 URL 필요 (`https://example.com/image.png`).

### 10.2 RSS 피드 생성

- **작업**
  - `apps/blog/src/app/feed.xml/route.ts` (또는 `feed.ts`):
    - RSS 2.0 형식으로 피드 생성
    - 최신 포스트 목록 (드래프트 제외, 날짜 내림차순)
    - 각 항목: title, link, description, pubDate
    - `Content-Type: application/rss+xml` 헤더 설정

- **DoD**: `/feed.xml` 접근 시 RSS 피드 XML 반환.

- **Verify**

  ```bash
  curl http://localhost:3000/feed.xml
  # RSS 리더에서 구독 테스트
  ```

- **Pitfalls**: 날짜 형식은 RFC 822 형식 (`Wed, 13 Nov 2025 00:00:00 +0000`).

### 10.3 관련 포스트 추천

- **작업**
  - `apps/blog/src/shared/lib/related-posts.ts`:
    - `getRelatedPosts(slug: string, allPosts: Post[], limit: number = 3)` 함수
    - 태그 기반 유사도 계산 (공통 태그 수)
    - 현재 포스트 제외
    - 유사도 높은 순 정렬, 동일 시 최신순
  - `apps/blog/src/app/[slug]/page.tsx`:
    - 관련 포스트 데이터 가져오기
    - 하단에 "관련 포스트" 섹션 렌더링
    - 카드 형태로 표시 (제목, 요약, 링크)

- **DoD**: 상세 페이지 하단에 관련 포스트 3-5개 표시.

- **Verify**: 태그가 겹치는 포스트가 있을 때 관련 포스트가 표시됨.

- **Pitfalls**: 태그가 없는 포스트는 관련 포스트 없음 처리.

### 10.4 읽기 진행도 표시

- **작업**
  - `apps/blog/src/widgets/reading-progress/ReadingProgress.tsx`:
    - `'use client'` 컴포넌트
    - `useEffect`로 스크롤 이벤트 리스너 등록
    - 스크롤 위치 기반 진행률 계산 (`scrollY / (documentHeight - windowHeight)`)
    - 진행 바 렌더링 (`<div>` 또는 `<progress>` 요소)
    - `aria-label="Reading progress"` 추가
  - `apps/blog/src/app/[slug]/layout.tsx` 또는 `page.tsx`:
    - `ReadingProgress` 컴포넌트 import 및 렌더링
    - 상단 고정 스타일 (`fixed top-0 left-0 right-0 z-50`)

- **DoD**: 스크롤 시 상단에 진행 바가 표시되고 진행률이 업데이트됨.

- **Verify**: 브라우저 개발자 도구에서 스크롤 이벤트 확인.

- **Pitfalls**: 스크롤 이벤트는 성능 고려하여 throttle/debounce 적용 권장.

### 10.5 태그 시스템 (스키마 확인 및 유지)

- **현재 상태**: `packages/schema/src/index.ts`에 `tags: z.array(z.string()).default([])` 이미 구현됨.
- **결정 사항**: 태그 시스템 유지 (카테고리 대신).
  - **이유**: 다중 분류 가능, 유연한 분류, SEO 유리, 관련 포스트 추천에 적합.
- **추가 작업 없음**: 스키마는 이미 태그 시스템으로 구현되어 있음.

---

## 11) 스모크 체크리스트 (PR 머지 전)

- [ ] `/` 목록 렌더(드래프트 제외, 날짜 정렬)
- [ ] `/:slug` 본문 렌더(GFM/테이블/인용/체크박스)
- [ ] 코드블록: 하이라이트/라인 넘버/파일명/라인·단어 하이라이트/복사 버튼
- [ ] 이미지: `<img>` → `<Image>` 매핑 정상
- [ ] (선택) 헤더 앵커/자동 링크
- [ ] (선택) Perf 데모 클릭 시 수치 표시
- [ ] SEO: 메타 태그, Open Graph, Twitter Cards, JSON-LD 구조화 데이터 확인
- [ ] SEO: `/sitemap.xml`, `/robots.txt` 접근 가능
- [ ] RSS: `/feed.xml` 접근 가능 및 RSS 리더에서 구독 테스트
- [ ] 관련 포스트: 상세 페이지 하단에 관련 포스트 표시
- [ ] 읽기 진행도: 스크롤 시 상단 진행 바 표시
- [ ] `pnpm run lint/typecheck/test:ci/build` 모두 green
- [ ] Vercel Preview/Prod 배포 정상

```

```

## 체크리스트

- [x] 모노레포 기본 구조 (2025. 11. 13. 09:59:18)
- [x] 공용 패키지 (2025. 11. 13. 09:59:06)
- [x] 블로그 앱 설정 (2025. 11. 13. 10:57:17)
- [x] MDX 처리 & 라우팅 (2025. 11. 13. 11:06:58)
- [x] 테스트 & 품질 (2025. 11. 13. 12:04:23)
- [x] CI/CD (2025. 11. 13. 12:08:25)
- [x] 개발 생산성 (2025. 11. 13. 12:15:00)
- [x] 초기 콘텐츠 (2025. 11. 13. 12:09:23)
- [ ] SEO 최적화 및 추가 기능
  - [ ] SEO 최적화 강화 (메타 태그, Open Graph, Twitter Cards, JSON-LD, Sitemap, Robots.txt)
  - [ ] RSS 피드 생성 (`/feed.xml`)
  - [ ] 관련 포스트 추천 (태그 기반)
  - [ ] 읽기 진행도 표시
