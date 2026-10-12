# HIDC CMS prototype

Client 사이트와 Admin 사이트가 하나의 블록 디자인을 공유하는 로컬 CMS 프로토타입입니다. Turborepo 내부 패키지로 콘텐츠 타입, 렌더러, 에디터, 저장소를 분리했습니다.

현재 버전은 제품 구조와 편집 흐름을 검증하기 위한 로컬 구현입니다. Supabase, Cloudflare R2, 인증과 권한 시스템은 포함하지 않습니다.

## 실행

요구 사항:

- Node.js 24 이상
- Yarn 1.22.22

```bash
yarn install
yarn dev
```

- Client: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3001](http://localhost:3001)

개별 앱만 실행할 수도 있습니다.

```bash
yarn workspace client dev
yarn workspace admin dev
```

## 프로젝트 구조

```text
apps/
├─ client/                 # 발행 글 목록과 상세 페이지
└─ admin/                  # 글 목록, 편집, 저장, 발행

packages/
├─ blocks/                 # 블록 타입과 공용 프론트 렌더러
├─ content/                # 글 모델과 저장소 인터페이스
├─ editor/                 # 관리자 블록 에디터
├─ ui/                     # Tailwind 진입점과 디자인 토큰
├─ eslint-config/
└─ typescript-config/
```

## 패키지 관계

```text
                         ┌──────────────┐
                         │ @repo/ui     │
                         │ theme / CSS  │
                         └──────┬───────┘
                                │
┌──────────────┐         ┌──────▼───────┐         ┌──────────────┐
│ apps/client  │────────▶│ @repo/blocks │◀────────│ apps/admin   │
│ public site  │         │ types / view │         │ CMS          │
└──────┬───────┘         └──────▲───────┘         └──────┬───────┘
       │                        │                         │
       │                 ┌──────┴───────┐                 │
       │                 │ @repo/editor │◀────────────────┘
       │                 └──────────────┘
       │
       └───────────────▶ @repo/content ◀──────────────────┘
                         model / repository
```

`client`와 Admin 미리보기는 모두 `@repo/blocks`의 `BlockRenderer`를 사용합니다. 블록 디자인을 한 곳에서 변경하면 두 화면에 동일하게 반영됩니다.

## 지원하는 CMS 흐름

1. Admin에서 새 글을 생성합니다.
2. 제목, slug, 요약을 작성합니다.
3. 제목·문단·이미지 블록을 추가하고 편집합니다.
4. 초안으로 저장하거나 바로 발행합니다.
5. 발행한 글은 Client 목록과 상세 페이지에 표시됩니다.
6. 발행을 취소하면 Client에서는 접근할 수 없습니다.

## 로컬 데이터

저장 전에는 `packages/content/src/sample-posts.ts`의 샘플 데이터를 사용합니다. 처음 저장하거나 발행하면 다음 파일이 생성됩니다.

```text
packages/content/data/posts.json
```

이 파일은 개발용 데이터이므로 Git에서 제외됩니다. 저장 구현은 `PostRepository` 뒤에 숨겨져 있어 추후 `FilePostRepository`를 `SupabasePostRepository`로 교체할 수 있습니다.

## 주요 명령어

```bash
yarn dev          # 전체 앱 개발 서버
yarn build        # 전체 프로덕션 빌드
yarn check-types  # 전체 TypeScript 검사
yarn lint         # 전체 ESLint 검사
yarn format       # TypeScript와 Markdown 포맷
```

Turborepo는 workspace 의존 관계를 읽어 패키지와 앱의 작업 순서를 결정하고 결과를 캐시합니다.

## 기술 선택

- Next.js App Router
- React 19
- Turborepo
- TypeScript
- Tailwind CSS
- Motion for React

Tailwind CSS는 `4.3.3`의 Oxide 메모리 문제를 피해 `4.1.18`로 고정했습니다. 업그레이드 전에는 관련 문제가 해결됐는지 다시 확인해야 합니다.

React Query와 Zustand는 현재 사용하지 않습니다. 공개 콘텐츠는 Server Component에서 읽고, 에디터 상태는 컴포넌트 지역 상태로 충분하기 때문입니다. 실제 서버 데이터 동기화나 복잡한 undo/redo 요구가 생겼을 때 도입 여부를 다시 결정합니다.

## 현재 범위 밖

- 사용자 인증과 관리자 권한
- Supabase 영구 저장
- Cloudflare R2 이미지 업로드
- 자동 저장
- 협업 편집
- 삭제와 복구
- 배포 환경의 캐시 무효화

이 기능들은 로컬 CMS 구조를 검증한 이후의 제품 개발 단계에서 추가합니다.
