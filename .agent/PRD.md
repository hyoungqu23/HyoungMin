# 1) 역할 인식과 목표 파악

- **역할**: 모노레포(Turborepo)로 `apps/blog`를 구축하는 Tech Lead.
- **목표**: Next.js v16(App Router) + React 19 + TypeScript + Tailwind CSS 4 + Zod 4 + **next-mdx-remote(RSC)** + **rehype-pretty-code** 기반 블로그를 FSD로 설계/구현.  
  GFM 100%(테이블/인용/체크리스트), **서버사이드 하이라이트**, **라인 넘버**, **파일 이름 표시**, **Copy 버튼**, **반응형 이미지** 지원.  
  CI(ESLint/TypeCheck/Test), **릴리즈 워크플로우(Changesets)**, **Vercel 배포**까지 자동화.

---

# 2) 결과 요약

- **콘텐츠 파이프라인**: `contents/articles/*.mdx` → `next-mdx-remote/rsc.compileMDX()` → `remark-gfm` + **`rehype-pretty-code`**(Shiki 내부 사용) → **Zod**로 frontmatter 검증 → App Router `[slug]` **SSG**.
- **컴포넌트 매핑**: `<MDXRemote components={{ pre: CodeBlock, img: MdxImage, ... }} />`.
- **성능/SEO**: 하이라이트는 서버(빌드/요청 시), 본문은 SSG, 상호작용은 최소 하이드레이션.
- **DX/유지보수**: Turborepo + 공용 ESLint/Prettier/TSConfig + 공용 UI 패키지 + 테스트(Vitest) + 릴리즈(Changesets) + 배포(Vercel).

# 3) 분석 단계(Manager) – PRD

## A. 요구사항

1. **문서 표현력**: GFM(테이블/체크리스트/각종 링크/스트라이크스루).
2. **코드 품질**: `rehype-pretty-code`로 **서버 하이라이트**, **라인 넘버**, **파일명(title) 표시**, **라인/단어 하이라이트**, **Copy 버튼**.
3. **상호작용**: MDX 본문에 React 데모(버튼, 폼, **로딩 속도 비교**, **애니메이션 전/후 비교** 등) 삽입.
4. **이미지**: `<img>`→`<Image>` 매핑으로 **반응형 최적화**.
5. **성능/SEO**: 정적 사전생성 + 부분 하이드레이션, Web Vitals 목표(FCP<1.8s, LCP<2.5s, INP<200ms).
6. **DX**: FSD, 공용 프리셋(ESLint/Prettier/TS), Zod 스키마 검증, 테스트 기본 세트.
7. **자동화**: CI(ESLint/TypeCheck/Test/Build) + 릴리즈(Changesets) + 배포(Vercel Preview/Prod).

## B. 비목표(Non-Goals)

- 외부 CMS 연동(향후 확장 가능).
- 전체 텍스트 검색(향후 도입 가능).

## C. 제약/전제

- **Tailwind v4**와 일부 플러그인(예: typography)의 완전 호환성은 **확실하지 않음** → 초기 이슈 시 v3 고정 후 점진 업그레이드.
- 원격 MDX 미사용(보안·안정성).
- Vercel 조직/프로젝트 ID는 환경마다 다름(**알 수 없습니다**) → 배포 문서에 비밀키/설정 안내 포함.

---

# 4) 실무 단계(Worker) – 기술 스펙(SDD)

## 4.1 모노레포 레이아웃(FSD 포함)

```
.
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
├─ tsconfig.base.json
└─ packages/
  ├─ eslint-config/ # 공용 ESLint preset
  ├─ prettier-config/ # 공용 Prettier preset
  ├─ typescript-config/ # 공용 TS configs
  ├─ schema/ # 공용 Zod 스키마(PostMeta, Post 등)
  ├─ ui/ # 공용 UI(CodeBlock, MdxImage, Prose)
└─ apps/
  └─ blog/
    ├─ package.json
    ├─ next.config.ts
    ├─ tailwind.config.ts
    ├─ postcss.config.js
    ├─ tsconfig.json
    ├─ contents/
    │ └─ posts/\*.mdx
    └─ src/
      ├─ app/ # pages layer
      │ ├─ layout.tsx
      │ ├─ page.tsx # 목록
      │ └─ [slug]/page.tsx # 상세
      ├─ root/ # providers, globals.css
      ├─ widgets/
      ├─ features/
      ├─ entities/
      │ └─ post/ # 도메인 모델 + UI(GET)
      └─ shared/
    ├─ lib/ # fs, mdx wrapper
    ├─ styles/
    └─ ui/

```

## 4.2 의존성

루트(dev): `turbo typescript eslint prettier vitest @vitest/coverage-v8 @types/node eslint-mdx`
공용(dep): `zod@^4`
앱(dep): `next@^16 react@^19 react-dom@^19 next-mdx-remote remark-gfm rehype-pretty-code shiki tailwindcss@^4 @tailwindcss/typography`
앱(dev): `autoprefixer postcss @testing-library/react @testing-library/jest-dom`

> Tailwind v4 플러그인 호환은 **확실하지 않음** → 이슈 시 v3로 롤백 가이드 제공.

## 4.3 MDX 컴파일(서버 하이라이트 확정)

```ts
// apps/blog/src/shared/lib/mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import { postMetaSchema } from '@hyoungmin/schema';

const prettyCodeOptions: Options = {
  theme: { light: 'github-light', dark: 'one-dark-pro' },
  keepBackground: false,
  filterMetaString: (meta) => meta, // title/filename/meta 그대로 유지
  onVisitLine(node) {
    // 빈 줄 렌더 유지
    if (node.children.length === 0) node.children = [{ type: 'text', value: ' ' }];
  },
  onVisitHighlightedLine(node) {
    node.properties.className = (node.properties.className || []).concat('highlighted');
  },
  onVisitHighlightedWord(node) {
    node.properties.className = (node.properties.className || []).concat('word--highlighted');
  },
};

export async function compilePostMDX(source: string, components: Record<string, any>) {
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    },
    components,
  });
  const meta = postMetaSchema.parse(frontmatter);
  return { content, meta };
}
```

### (선택) 헤더 자동 앵커/목차

원하면 다음 플러그인 추가:

```ts
// 설치: pnpm add rehype-slug rehype-autolink-headings
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// ...
mdxOptions: {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    [rehypePrettyCode, prettyCodeOptions],
  ],
}
```

## 4.4 글로벌 스타일(라인 넘버/하이라이트/파일명)

```css
/* apps/blog/src/root/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 라인 넘버 */
code[data-line-numbers] {
  counter-reset: line;
}
code[data-line-numbers] > [data-line]::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 2.5rem;
  margin-right: 1rem;
  text-align: right;
  opacity: 0.5;
}

/* 라인/단어 하이라이트 */
[data-highlighted-chars],
[data-highlighted-line],
.highlighted {
  background: color-mix(in oklab, currentColor 16%, transparent);
  border-left: 2px solid currentColor;
  display: block;
  margin: 0 calc(-1 * var(--p, 1rem));
  padding: 0 var(--p, 1rem);
}
.word--highlighted {
  outline: 2px solid color-mix(in oklab, currentColor 40%, transparent);
  border-radius: 0.25rem;
}

/* 파일명 헤더(플러그인이 data-title/… 달아준 경우 표시) */
pre[data-rehype-pretty-code-title]::before,
pre[data-title]::before {
  content: attr(data-rehype-pretty-code-title, attr(data-title));
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--tw-prose-pre-border, #e5e7eb);
  background: var(--tw-prose-pre-bg, #f8fafc);
}
```

## 4.5 공용 UI: CodeBlock(Ref 복사·접근성), MdxImage, Prose

```tsx
// packages/ui/src/CodeBlock.tsx
'use client';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export const CodeBlock = (props: any) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codeEl = preRef.current?.querySelector('code');
    const text = codeEl?.innerText ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className='relative my-6 group'>
      <pre ref={preRef} {...props} />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        aria-label='Copy code'
        onClick={handleCopy}
        className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition'
      >
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
};
```

> 파일명은 `rehype-pretty-code`가 `pre`에 `data-rehype-pretty-code-title`을 달면 CSS로 표시됩니다.

## 4.6 라우팅/FS/목록

- 기존 설계(SSG, `generateStaticParams`) 유지.
- 원격 이미지 사용 시 `next.config.ts`에 `images.remotePatterns` 추가.

## 4.7 CI / 릴리즈 / 배포

### CI(GitHub Actions) – 모노레포 전 패키지 대상으로 turbo 실행

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push: { branches: [main] }
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  ci:
    runs-on: ubuntu-latest
    env: { CI: true }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - name: Install
        run: pnpm install --frozen-lockfile
      - name: Lint
        run: pnpm turbo run lint --parallel
      - name: Typecheck
        run: pnpm turbo run typecheck --parallel
      - name: Test
        run: pnpm turbo run test:ci --parallel
      - name: Build
        run: pnpm turbo run build --parallel
```

### 릴리즈(Changesets)

- `@changesets/cli` 도입. main push 시 버전/태그/릴리즈 PR 또는 publish(NPM_TOKEN 설정 시) 자동.

### 배포(Vercel)

- **권장**: Git Integration에서 Root Directory를 `apps/blog`로 설정 → PR은 Preview, main은 Prod.
- **선택**: Vercel CLI 액션(`VERCEL_TOKEN/ORG_ID/PROJECT_ID`)로 Preview/Prod 분기 배포.

---

# 5) 평가 및 리스크(Evaluator)

- **요구 충족**: GFM/서버 하이라이트/라인 넘버/파일명/복사/반응형 이미지/CI/릴리즈/배포 ✅
- **리스크 & 완화**

  - Tailwind v4 플러그인 호환 **확실하지 않음** → v3 롤백 가이드/문서 제공.
  - 코드블록 누적 시 빌드시간↑ → Vercel 캐시/ISR, 포스트 분할 빌드 고려.

---

# 6) 최종 답변 정리

- 하이라이트 엔진은 **rehype-pretty-code 단일 채택**.
- 공용 프리셋/공용 UI 패키지/모노레포 CI부터 배포까지 일관 자동화.

---

# 7) 적극적인 가정 및 제안

- 문서 탐색성 향상을 위해 **rehype-slug + autolink-headings** 권장(옵션).
- 성능 데모는 `features/perf-demo`로 캡슐화해 MDX에서 손쉽게 삽입.

---

# 8) 형식 안내

- 본 문서는 **PRD + SDD + CI/CD** 통합 문서입니다. 바로 레포에 `PRD.md`로 추가하세요.

---

## 핵심 요약

- **Next 16 + React 19 + TS + Tailwind 4 + Zod + next-mdx-remote + rehype-pretty-code**.
- **FSD + 공용 프리셋/공용 UI**로 DX 일관성.
- **CI(ESLint/TypeCheck/Test/Build) + Changesets + Vercel** 자동화 파이프라인.
