# Vercel 배포 전략 (모노레포)

## 개요

모노레포 구조에서 Vercel 배포와 Changesets 릴리즈 관리를 통합하는 전략입니다.

## 브랜치 전략

### 1. 브랜치 구조

```
main (production)
├── feature/* (preview)
└── release/* (optional, for major releases)
```

- **main**: 프로덕션 배포 브랜치
- **feature/***: PR 브랜치 → Vercel Preview 자동 배포
- **release/***: (선택) 주요 릴리즈 전용 브랜치

### 2. 브랜치별 배포 동작

| 브랜치 | Vercel 배포 | Changesets | 목적 |
|--------|------------|------------|------|
| `main` | Production | 버전 업데이트 후 배포 | 프로덕션 |
| `feature/*` | Preview | 미사용 | 개발/리뷰 |
| PR | Preview | 미사용 | 리뷰 |

## Vercel 설정 (Git Integration - 권장)

### 1. 프로젝트 연결

1. Vercel Dashboard → Add New Project
2. GitHub 저장소 선택
3. **Root Directory**: `apps/blog` 설정 ⚠️ 중요
4. Framework Preset: Next.js
5. Build Command: `cd ../.. && pnpm turbo run build --filter=blog`
6. Output Directory: `.next` (기본값)

### 2. 환경 변수 (필요시)

- Vercel Dashboard → Settings → Environment Variables
- 예: `NODE_ENV=production`

### 3. 브랜치별 설정

- **Production Branch**: `main`
- **Preview Branches**: 모든 브랜치 활성화 (기본값)

## Changesets와 연동 전략

### 1. 워크플로우

```
개발 → Changeset 추가 → PR → main 병합 → Changesets 버전 업데이트 → Production 배포
```

### 2. Changesets 사용법

#### Changeset 추가
```bash
pnpm changeset
```
- 변경 사항 선택 (major/minor/patch)
- 변경 설명 작성
- `.changeset/*.md` 파일 생성

#### PR 생성
```bash
git checkout -b feature/my-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
# GitHub에서 PR 생성
```

#### main 병합 후
1. GitHub Actions가 자동으로 실행
2. Changesets가 버전 업데이트 PR 생성
3. 버전 PR 병합 시 Production 배포 트리거

### 3. Changesets 릴리즈 PR 예시

Changesets가 생성하는 PR:
- 제목: `chore: version packages`
- 내용: CHANGELOG 업데이트 + 버전 번호 증가
- 병합 시: Production 배포 자동 트리거

## 배포 시나리오

### 시나리오 1: 일반 기능 개발

1. **개발**
   ```bash
   git checkout -b feature/new-post
   # 코드 작성
   git commit -m "feat: add new post"
   git push origin feature/new-post
   ```

2. **PR 생성**
   - GitHub에서 PR 생성
   - Vercel Preview URL 자동 생성
   - 리뷰어가 Preview에서 확인

3. **Changeset 추가 (필요시)**
   ```bash
   pnpm changeset
   # 변경 사항 선택 및 설명 작성
   git add .changeset/
   git commit -m "chore: add changeset"
   git push
   ```

4. **main 병합**
   - PR 승인 후 main에 병합
   - CI 통과 확인
   - Changesets가 버전 PR 생성 (변경사항이 있는 경우)

5. **Production 배포**
   - 버전 PR 병합 또는 main 직접 푸시 시
   - Vercel이 자동으로 Production 배포

### 시나리오 2: 버전 릴리즈

1. **Changeset 추가**
   ```bash
   pnpm changeset
   # major/minor/patch 선택
   ```

2. **PR 생성 및 병합**
   ```bash
   git checkout -b release/v1.0.0
   git add .changeset/
   git commit -m "chore: prepare release v1.0.0"
   git push origin release/v1.0.0
   # PR 생성 → 병합
   ```

3. **Changesets 버전 PR 자동 생성**
   - GitHub Actions가 버전 업데이트 PR 생성
   - CHANGELOG 업데이트 확인

4. **버전 PR 병합**
   - 버전 PR 병합 시 Production 배포 트리거
   - Git 태그 자동 생성 (설정 시)

## GitHub Actions와 통합

### 현재 워크플로우

1. **CI** (`.github/workflows/ci.yml`)
   - 모든 PR과 main push에서 실행
   - lint, typecheck, test, build

2. **Release** (`.github/workflows/release.yml`)
   - main 브랜치 push 시 실행
   - Changesets 버전 관리

### Vercel과의 통합

- Vercel Git Integration 사용 시 GitHub Actions는 선택사항
- Vercel이 자동으로 빌드 및 배포 수행
- CI는 코드 품질 검증용으로 유지

## 모니터링 및 알림

### Vercel Dashboard

- 배포 상태 확인
- 빌드 로그 확인
- 환경 변수 관리
- 도메인 설정

### GitHub

- PR에 Preview URL 자동 표시
- 배포 상태 확인 (Vercel GitHub App)

## 트러블슈팅

### 문제: Vercel이 루트에서 빌드 시도

**해결**: Root Directory를 `apps/blog`로 설정

### 문제: 의존성 설치 실패

**해결**: Build Command에 `cd ../.. && pnpm install --frozen-lockfile` 추가

### 문제: Changesets 버전 PR이 생성되지 않음

**해결**: 
- `.changeset/` 폴더에 changeset 파일이 있는지 확인
- GitHub Actions 로그 확인
- `GITHUB_TOKEN` 권한 확인

## 권장 사항

1. **Git Integration 사용**: 가장 간단하고 안정적
2. **Root Directory 설정**: 모노레포에서 필수
3. **Changesets 활용**: 버전 관리를 체계적으로
4. **Preview 활용**: PR마다 자동 Preview 생성으로 리뷰 효율화
5. **CI 유지**: Vercel 배포 전 코드 품질 검증

## 참고 자료

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Turborepo with Vercel](https://turbo.build/repo/docs/handbook/deploying-to-vercel)

