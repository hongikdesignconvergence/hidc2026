import type { ContentDocument } from "./types";

export const exampleDocument = {
  version: 1,
  blocks: [
    {
      id: "title-1",
      type: "title",
      content: { text: "공유 블록으로 만든 첫 번째 글" },
    },
    {
      id: "paragraph-1",
      type: "paragraph",
      content: {
        text: "이 문서는 client와 admin에서 같은 컴포넌트로 렌더링됩니다.",
      },
    },
    {
      id: "image-1",
      type: "image",
      content: {
        src: "/window.svg",
        alt: "샘플 이미지",
        caption: "현재는 샘플 이미지이며 이후 Cloudflare R2와 연결합니다.",
      },
    },
  ],
} satisfies ContentDocument;
