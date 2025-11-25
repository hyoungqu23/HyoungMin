# Blog Editor

Tauri v2 + Next.js 16 기반의 데스크톱 블로그 에디터 애플리케이션입니다.

## 기능

- **메타데이터 입력**: 제목, 설명, 태그, 작성일 등 포스트 메타데이터 관리
- **Monaco Editor**: VSCode 기반의 강력한 마크다운 에디터
- **실시간 프리뷰**: MDX 렌더링으로 실시간 미리보기
- **이미지 처리**: ffmpeg를 통한 자동 WebP 변환 및 압축
- **GitHub 연동**: 자동 commit/push로 블로그에 바로 배포

## 요구사항

- Node.js 18+
- Rust (최신 stable)
- pnpm
- ffmpeg (이미지 처리용)
- Git

## 설치

```bash
# 프로젝트 루트에서
pnpm install
```

## 개발

```bash
# Next.js 개발 서버만 실행
pnpm --filter editor dev

# Tauri 앱으로 실행 (권장)
pnpm --filter editor tauri:dev
```

## 빌드

```bash
# Next.js 빌드
pnpm --filter editor build

# Tauri 앱 빌드 (릴리즈)
pnpm --filter editor tauri:build
```

## 환경변수

GitHub 연동을 위해 환경변수를 설정해야 합니다:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

## 프로젝트 구조

```
apps/editor/
├── src/                    # Next.js 프론트엔드
│   ├── app/                # App Router
│   ├── components/         # React 컴포넌트
│   │   └── editor/         # 에디터 관련 컴포넌트
│   └── lib/                # 유틸리티
├── src-tauri/              # Tauri Rust 백엔드
│   ├── src/
│   │   ├── commands/       # Tauri Commands
│   │   │   ├── github.rs   # GitHub 연동
│   │   │   └── image.rs    # 이미지 처리
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
└── package.json
```

## 사용 방법

1. 에디터 앱 실행
2. 왼쪽 사이드바에서 메타데이터 입력
3. 중앙 Monaco Editor에서 마크다운 작성
4. 이미지 드래그앤드롭으로 자동 WebP 변환 및 삽입
5. 오른쪽 프리뷰에서 실시간 확인
6. "GitHub에 제출" 버튼으로 자동 배포

## 키보드 단축키

- `Cmd/Ctrl + B`: 볼드
- `Cmd/Ctrl + I`: 이탤릭
- `Cmd/Ctrl + K`: 링크 삽입

