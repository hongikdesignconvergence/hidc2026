import type { Post } from "./post";

export const samplePosts: Post[] = [
  {
    id: "post-hidc-2026",
    title: "HIDC 2026을 준비하며",
    slug: "preparing-hidc-2026",
    excerpt: "새로운 웹사이트와 CMS를 설계하는 과정을 소개합니다.",
    status: "published",
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-10T09:00:00.000Z",
    publishedAt: "2026-10-10T09:00:00.000Z",
    document: {
      version: 1,
      blocks: [
        {
          id: "hidc-title",
          type: "title",
          content: { text: "HIDC 2026을 준비하며" },
        },
        {
          id: "hidc-paragraph",
          type: "paragraph",
          content: {
            text: "공개 사이트와 관리자 미리보기가 하나의 블록 디자인을 공유하도록 Turborepo 구조를 설계하고 있습니다.",
          },
        },
        {
          id: "hidc-image",
          type: "image",
          content: {
            src: "/window.svg",
            alt: "HIDC 웹사이트 샘플",
            caption: "공통 블록 렌더러로 표현한 이미지 블록",
          },
        },
      ],
    },
  },
  {
    id: "post-shared-blocks",
    title: "공유 블록 시스템 설계",
    slug: "shared-block-system",
    excerpt: "client와 admin이 같은 블록 View를 사용하는 방법을 정리합니다.",
    status: "published",
    createdAt: "2026-10-03T09:00:00.000Z",
    updatedAt: "2026-10-09T09:00:00.000Z",
    publishedAt: "2026-10-09T09:00:00.000Z",
    document: {
      version: 1,
      blocks: [
        {
          id: "blocks-title",
          type: "title",
          content: { text: "한 번 디자인하고 두 곳에서 사용하기" },
        },
        {
          id: "blocks-paragraph",
          type: "paragraph",
          content: {
            text: "블록의 데이터 타입과 실제 View를 공용 패키지에 두면 공개 페이지와 관리자 미리보기의 결과가 어긋나지 않습니다.",
          },
        },
      ],
    },
  },
  {
    id: "post-editor-notes",
    title: "에디터 아이디어 노트",
    slug: "editor-ideas",
    excerpt: "추가할 블록과 편집 경험을 검토 중인 초안입니다.",
    status: "draft",
    createdAt: "2026-10-08T09:00:00.000Z",
    updatedAt: "2026-10-11T09:00:00.000Z",
    publishedAt: null,
    document: {
      version: 1,
      blocks: [
        {
          id: "ideas-title",
          type: "title",
          content: { text: "에디터 아이디어 노트" },
        },
        {
          id: "ideas-paragraph",
          type: "paragraph",
          content: {
            text: "현재는 제목, 문단, 이미지 블록만 사용하고 실제 요구가 확인된 뒤 블록 종류를 확장합니다.",
          },
        },
      ],
    },
  },
];
