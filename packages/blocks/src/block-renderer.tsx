import type {
  ContentBlock,
  ContentDocument,
  ImageBlock,
  ParagraphBlock,
  TitleBlock,
} from "./types";

function TitleBlockView({ block }: { block: TitleBlock }) {
  return (
    <h1 className="text-4xl leading-[1.1] font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
      {block.content.text}
    </h1>
  );
}

function ParagraphBlockView({ block }: { block: ParagraphBlock }) {
  return (
    <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">
      {block.content.text}
    </p>
  );
}

function ImageBlockView({ block }: { block: ImageBlock }) {
  return (
    <figure className="space-y-3">
      {/* R2 도메인을 연결하기 전까지 공통 렌더러는 표준 img를 사용합니다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="aspect-[16/9] w-full rounded-2xl border bg-canvas object-contain p-12"
        src={block.content.src}
        alt={block.content.alt}
      />
      {block.content.caption ? (
        <figcaption className="text-sm leading-6 text-muted">
          {block.content.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "title":
      return <TitleBlockView block={block} />;
    case "paragraph":
      return <ParagraphBlockView block={block} />;
    case "image":
      return <ImageBlockView block={block} />;
  }
}

export function BlockRenderer({ document }: { document: ContentDocument }) {
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-10 rounded-3xl border bg-paper px-6 py-12 shadow-[0_24px_80px_rgba(24,24,22,0.06)] sm:px-12 sm:py-16">
      {document.blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </article>
  );
}
