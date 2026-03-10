# Supabase CLI 가이드 for CoupleLine

이 문서는 **2026-03-11 기준 Supabase 공식 CLI 문서**를 바탕으로, 이 레포(`apps/couple-line`)에서 실제로 어떻게 써야 하는지 정리한 운영 가이드입니다.

## 한 줄 결론

Supabase CLI는 **레포 전체를 알아서 파싱해서 앱 구조를 이해하는 도구가 아닙니다.**

대신 아래를 담당합니다.

- 로컬 Supabase 스택 실행
- DB migration 관리
- 원격 DB schema pull / 로컬 migration push
- DB 기반 TypeScript 타입 생성
- Edge Functions 로컬 실행/배포

즉, 이 레포에서는 **"레포 분석"은 개발자/에디터가 하고, "Supabase 실행/동기화"는 CLI가 담당**한다고 이해하면 됩니다.

---

## 이 레포에서 CLI로 가능한 것

현재 레포 상태:

- `supabase/migrations/20260310123000_coupleline_init.sql` 존재
- `supabase/config.toml` 존재
- `supabase/seed.sql` 존재
- `src/shared/api/supabase/database.types.ts` 존재

따라서 이 레포에서 Supabase CLI로 할 일은 크게 5가지입니다.

1. `supabase init`으로 로컬 설정 파일 만들기
2. `supabase start`로 로컬 Supabase 실행
3. `supabase db reset` / `supabase db push`로 migration 적용
4. `supabase link` / `supabase db pull`로 원격 프로젝트와 동기화
5. `supabase gen types`로 타입 재생성

---

## 1. 설치

### 방법 A. 일회성 실행

```bash
npx supabase --help
```

### 방법 B. dev dependency로 설치 추천

```bash
npm install -D supabase
```

설치 후에는 아래처럼 써도 됩니다.

```bash
npx supabase start
```

> CoupleLine처럼 앱 레포 안에서 반복적으로 쓸 거면 **dev dependency 설치**를 추천합니다.

---

## 2. CoupleLine 로컬 우선 세팅

이 레포는 **로컬 Supabase를 먼저 붙여서 개발하는 흐름**을 추천합니다.

권장 순서:

```bash
npm install
npm run supabase:start
npx supabase status -o env
cp .env.local.example .env.local
npm run supabase:db:reset
npm run supabase:types:local
npm run dev
```

### 왜 이 순서인가

- `supabase start`가 로컬 API / DB / Auth / Studio를 띄웁니다.
- `supabase status -o env`가 현재 로컬 프로젝트용 `API_URL`, `ANON_KEY`를 내보냅니다.
- `.env.local`은 앱에서만 읽히므로, 원격 `.env`를 덮지 않고도 로컬로 전환할 수 있습니다.
- `db reset`은 migration과 seed를 깨끗하게 재적용합니다.
- `gen types --local`은 현재 로컬 스키마 기준 타입을 다시 만듭니다.

## 3. 이 레포에서 최초 1회 세팅

레포 루트에서 실행:

```bash
npx supabase init
```

또는 package script:

```bash
npm run supabase:init
```

이 명령은 공식 문서 기준 `supabase/config.toml`을 생성합니다.

### 주의

이 레포에는 이미 `supabase/migrations` 폴더가 있으므로,
`init`은 **migration을 지우는 용도는 아니고 config를 채우는 용도**로 보면 됩니다.

초기화 후 기대 구조 예시:

```txt
supabase/
  config.toml
  migrations/
    20260310123000_coupleline_init.sql
```

---

## 4. 로컬 Supabase 실행

```bash
npx supabase start
```

또는:

```bash
npm run supabase:start
```

공식 문서 기준 이 명령은 로컬에서 다음을 띄웁니다.

- Postgres
- Auth
- Storage
- Studio
- API Gateway
- 기타 로컬 개발 보조 서비스

실행 후 출력되는 대표 값들:

- API URL
- DB URL
- Studio URL
- anon key
- service role key

### CoupleLine에서 같이 해야 하는 것

로컬 stack으로 개발할 때는 `.env`를 직접 바꾸기보다 `.env.local`을 쓰는 편이 안전합니다.

예시:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<npx supabase status -o env 의 ANON_KEY>
```

공식 CLI 레퍼런스 기준 `supabase status -o env`는 `ANON_KEY`, `SERVICE_ROLE_KEY` 같은 연결 값을 내보낼 수 있습니다.  
이 레포는 현재 앱 환경 변수 이름을 `VITE_SUPABASE_ANON_KEY`로 쓰고 있으므로, **로컬에서는 `ANON_KEY` 값을 여기에 넣으면 됩니다.**

원격 프로젝트를 계속 쓸 거면 기존 `.env`는 유지하고, 로컬 전환이 필요할 때만 `.env.local`을 추가하세요.

---

## 5. migration 적용 방식

### 로컬 DB를 현재 migration 기준으로 초기화

```bash
npx supabase db reset
```

또는:

```bash
npm run supabase:db:reset
```

이 프로젝트에서는 가장 중요한 명령 중 하나입니다.

언제 쓰면 좋나:

- `supabase/migrations` 내용을 로컬 DB에 다시 정확히 반영하고 싶을 때
- migration 수정 후 로컬 상태를 깨끗하게 재현하고 싶을 때
- 협업 중 동일한 schema 상태를 강제로 맞추고 싶을 때

### 원격 Supabase 프로젝트에 migration 반영

```bash
npx supabase db push
```

또는:

```bash
npm run supabase:db:push
```

언제 쓰면 좋나:

- 로컬에서 검증한 migration을 실제 Supabase 프로젝트에 반영할 때
- 배포 직전/직후 schema를 맞출 때

---

## 6. 로컬 Auth / Google OAuth

CoupleLine 로그인은 **Google OAuth만 지원**합니다. 그래서 로컬 DB만 띄우는 것과, **로컬에서 실제 Google 로그인을 완료하는 것**은 별개의 문제입니다.

공식 Google 로그인 문서 기준으로 로컬 개발 시 필요한 값은 아래 두 군데에 나뉩니다.

### A. Supabase local config

`supabase/config.toml`

- `auth.site_url = "http://localhost:3000"`
- `auth.additional_redirect_urls`
  - `http://localhost:3000/auth/callback`
  - `http://127.0.0.1:3000/auth/callback`
- `[auth.external.google]`
  - `enabled = true`
  - `client_id = "<google web client id>"`
  - `secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET)"`

이 레포의 `config.toml`에는 이미 CoupleLine용 redirect URL과 Google provider 템플릿을 넣어두었습니다.

### B. Google Cloud Console

공식 문서 기준, 로컬 개발에서는 아래를 등록해야 합니다.

- Authorized JavaScript origins
  - `http://localhost:3000`
  - 필요하면 `http://127.0.0.1:3000`
- Authorized redirect URI
  - `http://127.0.0.1:54321/auth/v1/callback`

### C. 비밀값 보관

루트 `.env`에 아래 값을 넣는 방식을 추천합니다.

```env
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

이 값은 Vite 클라이언트에 노출되지 않고, Supabase CLI의 `env(...)` 치환에만 쓰입니다.

설정 후에는 공식 config 문서대로 `supabase stop` → `supabase start`로 다시 띄워야 반영됩니다.

---

## 7. 원격 반영 전에 필요한 것

원격 Supabase 프로젝트에 CoupleLine을 반영하려면, CLI 명령 자체보다 먼저 **어디서 어떤 값을 가져와야 하는지**를 알아두는 게 중요합니다.

### A. Supabase Personal Access Token

`supabase login`에 필요합니다.

어디서 가져오나:

- Supabase Dashboard → Account → **Access Tokens**
- 또는 공식 문서에 나온 URL: `https://supabase.com/dashboard/account/tokens`

언제 쓰나:

- `npm run supabase:login`
- CI에서 Management API를 쓸 때

### B. Project Ref

`supabase link --project-ref <project-ref>`에 필요합니다.

어디서 가져오나:

- Supabase Dashboard 프로젝트 URL

예시:

```txt
https://supabase.com/dashboard/project/<project-ref>
```

### C. 원격 DB 비밀번호

일부 `link` / `db push` / `db pull` 흐름에서 프롬프트가 뜰 수 있습니다.

어디서 가져오나:

- Supabase Dashboard → Project → **Settings → Database**

CLI 참고사항:

- 공식 CLI 레퍼런스 기준, 비밀번호 프롬프트를 피하려면 `SUPABASE_DB_PASSWORD` 환경 변수를 쓸 수 있습니다.

예시:

```bash
export SUPABASE_DB_PASSWORD='your-db-password'
```

### D. 앱이 사용할 원격 URL + 클라이언트 키

프론트엔드 배포 환경 변수에 필요합니다.

어디서 가져오나:

- Supabase Dashboard → **Connect** 다이얼로그
- 또는 Project → **Settings → API / API Keys**

CoupleLine에서 필요한 값:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon 또는 publishable key>
```

주의:

- 공식 문서 기준 Supabase는 `publishable key` 사용을 권장합니다.
- 다만 CoupleLine 레포의 현재 환경 변수 이름은 `VITE_SUPABASE_ANON_KEY`라서, **실제로는 publishable key를 여기에 넣어도 됩니다.**
- `service_role` / `secret key`는 절대 브라우저 환경 변수에 넣으면 안 됩니다.

### E. Google OAuth Client ID / Secret

CoupleLine은 Google 로그인만 지원하므로 원격에서도 필요합니다.

어디서 가져오나:

- Google Cloud Console → APIs & Services → **Credentials**
- OAuth 2.0 Client ID 생성 후
  - Client ID
  - Client Secret

### F. Google / Supabase에 등록할 redirect URL

#### Google Cloud Console 쪽

Authorized redirect URI:

```txt
https://<project-ref>.supabase.co/auth/v1/callback
```

#### Supabase Dashboard 쪽

앱 redirect allow-list:

- `http://localhost:3000/auth/callback`
- `http://127.0.0.1:3000/auth/callback`
- `https://<your-production-domain>/auth/callback`

원격 Google provider 설정 위치:

- Supabase Dashboard → Authentication → Sign In / Providers → **Google**

---

## 8. 원격 프로젝트 연결

먼저 로그인:

```bash
npm run supabase:login
```

그 다음 프로젝트 연결:

```bash
npm run supabase:link -- --project-ref <project-ref>
```

필요하면 DB 비밀번호도 같이:

```bash
SUPABASE_DB_PASSWORD='your-db-password' npm run supabase:link -- --project-ref <project-ref>
```

### 언제 `link`가 필요한가

다음 명령은 보통 `link` 이후에 씁니다.

- `supabase db push`
- `supabase db pull`
- `supabase gen types --linked`

---

## 9. CoupleLine 원격 반영 절차

### 케이스 A. 새 원격 프로젝트에 처음 반영할 때

1. Supabase Dashboard에서 새 프로젝트 생성
2. `npm run supabase:login`
3. `npm run supabase:link -- --project-ref <project-ref>`
4. `npm run supabase:db:push`
5. `npm run supabase:types:linked`
6. 프론트엔드 배포 환경 변수 설정
7. Google OAuth 설정

권장 명령 순서:

```bash
npm run supabase:login
npm run supabase:link -- --project-ref <project-ref>
npm run supabase:db:push
npm run supabase:types:linked
npm run lint
npm run build
```

### 케이스 B. 이미 원격에 수동 변경이 있는 경우

이 경우는 `db push` 전에 먼저 확인해야 합니다.

```bash
npm run supabase:login
npm run supabase:link -- --project-ref <project-ref>
npm run supabase:db:pull
```

그 다음:

1. 새로 생성된 migration 검토
2. 기존 migration과 충돌 정리
3. 필요한 경우 로컬에서 다시 `db reset`
4. 마지막에 `db push`

### 케이스 C. 원격에 앱 env 반영

배포 플랫폼(Vercel, Netlify 등)의 환경 변수에 아래를 넣습니다.

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon 또는 publishable key>
```

그리고 배포 도메인을 Supabase Auth redirect allow-list에 추가합니다.

예시:

```txt
https://<your-production-domain>/auth/callback
```

---

## 10. 원격 DB에서 migration 받아오기

```bash
npm run supabase:db:pull
```

이 명령은 **원격 DB schema를 migration 파일로 가져오는 용도**입니다.

### CoupleLine에서 언제 써야 하나

#### 케이스 A. 원격 DB가 비어 있거나 아직 초기 세팅 전

이 경우는 `db pull`보다 아래 순서가 맞습니다.

1. `supabase link`
2. `supabase db push`

#### 케이스 B. 이미 대시보드에서 원격 DB를 수동 변경해버림

이 경우는 아래 순서가 맞습니다.

1. `supabase link`
2. `supabase db pull`
3. 생성된 migration 검토
4. 레포 migration과 충돌 없는지 정리

### 주의

이 레포는 이미 `20260310123000_coupleline_init.sql`을 갖고 있으므로,
**원격에 수동 변경이 없으면 함부로 `db pull`부터 하지 않는 편이 안전**합니다.

---

## 11. 타입 재생성

현재 레포에서는 타입 파일로 아래를 사용합니다.

```txt
src/shared/api/supabase/database.types.ts
```

### 로컬 타입 재생성

```bash
npm run supabase:types:local
```

### 링크된 원격 프로젝트 기준 타입 재생성

```bash
npm run supabase:types:linked
```

주의:

- 로컬/원격 타입 재생성 후에는 `npm run lint`, `npm run build`까지 확인하는 편이 안전합니다.
- CoupleLine은 generated type의 nullability를 코드에서 흡수하고 있으므로, 타입 재생성 후 TS 에러가 나면 먼저 서버 함수 반환 타입을 확인하세요.

---

## 12. CoupleLine 기준 추천 워크플로우

### 로컬에서 스키마/기능 개발할 때

1. `npm run supabase:start`
2. `npm run supabase:db:reset`
3. SQL migration 수정 또는 신규 migration 추가
4. `npm run supabase:types:local`
5. 앱에서 검증

### 원격에 반영할 때

1. `npm run supabase:login`
2. `npm run supabase:link -- --project-ref <project-ref>`
3. `npm run supabase:db:push`
4. `npm run supabase:types:linked`
5. 배포 환경 변수 / Auth redirect 설정 확인

### 원격에서 수동 변경을 이미 해버렸을 때

1. `npm run supabase:login`
2. `npm run supabase:link -- --project-ref <project-ref>`
3. `npm run supabase:db:pull`
4. 생성된 migration 검토 후 정리

---

## 13. 추가된 package scripts

이 레포에는 아래 스크립트를 넣어두었습니다.

```bash
npm run supabase:login
npm run supabase:link -- --project-ref <project-ref>
npm run supabase:init
npm run supabase:start
npm run supabase:stop
npm run supabase:status
npm run supabase:db:reset
npm run supabase:db:push
npm run supabase:db:pull
npm run supabase:migration:new -- add_some_change
npm run supabase:types:local
npm run supabase:types:linked
```

### 자주 쓰는 조합

로컬 초기화:

```bash
npm run supabase:start
npm run supabase:db:reset
npm run supabase:types:local
```

원격 반영:

```bash
npm run supabase:login
npm run supabase:link -- --project-ref <project-ref>
npm run supabase:db:push
npm run supabase:types:linked
```

이후 생성된 migration을 리뷰하고, 기존 migration 히스토리와 충돌이 없는지 확인합니다.

---

## 9. Edge Functions는 지금 당장 필요한가?

현재 CoupleLine 레포는 TanStack Start server functions를 쓰고 있고,
`supabase/functions` 디렉터리는 아직 없습니다.

그래서 **지금 단계에서는 Edge Functions가 필수는 아닙니다.**

나중에 필요하면 그때 아래 명령을 씁니다.

```bash
npx supabase functions serve
npx supabase functions deploy <function-name>
```

적합한 예시:

- 외부 웹훅 처리
- cron / background task
- service role이 꼭 필요한 외부 연동

---

## 10. 이 레포에서 “레포 파서”처럼 기대하면 안 되는 것

Supabase CLI가 자동으로 해주지 않는 것:

- React/TanStack Start 코드 읽고 테이블 설계 자동 생성
- 폼/쿼리 로직을 보고 migration 자동 작성
- RLS 정책을 비즈니스 로직에 맞게 자동 설계
- 프론트엔드에서 쓰는 타입과 DB 스키마 충돌 자동 해결

즉, **CLI는 실행/동기화 도구**이고,
**설계 판단은 개발자가 해야 합니다.**

---

## 11. 이 레포 기준 추천 운영 원칙

1. **대시보드에서 직접 schema 수정하지 말기**
   - 가능하면 항상 migration으로 관리

2. **타입 파일은 schema 변경 후 바로 재생성하기**
   - `src/shared/api/supabase/database.types.ts`

3. **원격 반영 전 로컬 reset/build 검증하기**

4. **`db pull`은 예외 상황에서만 쓰기**
   - 이미 원격에서 수동 변경이 있었을 때만

5. **초기 프로젝트 세팅 문서는 README보다 이 문서를 우선 보기**

---

## 12. 공식 문서

아래 문서를 기준으로 정리했습니다.

- Supabase CLI getting started  
  https://supabase.com/docs/guides/cli/getting-started
- Local development with schema migrations  
  https://supabase.com/docs/guides/cli/local-development
- CLI reference: `supabase link`, `db pull`, `db push`, `gen types`  
  https://supabase.com/docs/reference/cli/supabase-orgs-list
- CLI reference: `supabase db` subcommands  
  https://supabase.com/docs/reference/cli/supabase-db-dump
- Edge Functions local development  
  https://supabase.com/docs/guides/functions/development-environment
