# CoupleLine

커플을 위한 복식부기 가계부 웹앱입니다.

## Stack

- TanStack Start + React 19
- Tailwind CSS v4 + shadcn/ui
- React Hook Form + Zod v4
- TanStack Table
- Supabase Auth / Postgres / Google OAuth
- Feature-Sliced Design (shared / entities / features / widgets / pages / app)

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

필수 환경 변수:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Local Supabase first workflow

```bash
npm install
npm run supabase:start
npx supabase status -o env
cp .env.local.example .env.local
npm run supabase:db:reset
npm run supabase:types:local
npm run dev
```

- `.env.local`에는 로컬 `API_URL`, `ANON_KEY`를 넣습니다.
- Google OAuth를 로컬에서 붙이려면 `supabase/config.toml`의 `[auth.external.google]`을 채우고 다시 시작하세요.

## Supabase setup

1. Supabase 프로젝트를 생성합니다.
2. `supabase/migrations/20260310123000_coupleline_init.sql`를 실행합니다.
3. Supabase Auth에서 Google OAuth를 활성화합니다.
4. Redirect URL에 아래를 추가합니다.
   - `http://localhost:3000/auth/callback`
   - 배포 도메인의 `/auth/callback`

자세한 CLI 워크플로우는 `docs/supabase-cli-guide.md`를 참고하세요.

### Useful Supabase scripts

```bash
npm run supabase:init
npm run supabase:start
npm run supabase:db:reset
npm run supabase:types:local
```

원격 프로젝트 연결 후:

```bash
npm run supabase:login
npm run supabase:link
npm run supabase:db:push
npm run supabase:types:linked
```

## Included features

- Google OAuth 로그인
- 공간 생성 / 초대 링크 / 합류
- 공간별 RLS 보호
- 대시보드
  - 최근 12개월 순자산·수입·지출 추이
  - 월별 지출 도넛 + 랭킹
  - 자산 성격별 포트폴리오
  - KPI 카드 / 계정 상세 테이블
- 거래 내역 입력 + 목록 + 삭제
- 카테고리 CRUD
- 계정 CRUD
- 참여자 목록 / OWNER 전용 역할 변경 / 초대 링크 발급

## Verification

```bash
npm run lint
npm run build
```
