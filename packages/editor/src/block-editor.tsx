"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BlockRenderer } from "@repo/blocks";
import type {
  ContentBlock,
  ContentDocument,
  ImageBlock,
  ParagraphBlock,
  TitleBlock,
} from "@repo/blocks";

type BlockType = ContentBlock["type"];

export type EditorPostMetadata = {
  title: string;
  slug: string;
  excerpt: string;
};

export type EditorPostValue = {
  metadata: EditorPostMetadata;
  document: ContentDocument;
};

const blockNames: Record<BlockType, string> = {
  title: "제목",
  paragraph: "문단",
  image: "이미지",
};

const fieldClassName =
  "w-full rounded-xl border bg-paper px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-2 focus:ring-ink/10";

const smallButtonClassName =
  "rounded-lg border bg-paper px-2.5 py-1.5 text-xs font-medium text-muted transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-30";

function createBlock(type: BlockType): ContentBlock {
  const id = `${type}-${crypto.randomUUID()}`;

  switch (type) {
    case "title":
      return { id, type, content: { text: "새 제목" } };
    case "paragraph":
      return { id, type, content: { text: "새 문단을 입력하세요." } };
    case "image":
      return {
        id,
        type,
        content: { src: "/window.svg", alt: "", caption: "" },
      };
  }
}

function TitleControls({
  block,
  onChange,
}: {
  block: TitleBlock;
  onChange: (block: TitleBlock) => void;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium text-muted">
      제목
      <input
        className={fieldClassName}
        value={block.content.text}
        onChange={(event) =>
          onChange({
            ...block,
            content: { text: event.target.value },
          })
        }
      />
    </label>
  );
}

function ParagraphControls({
  block,
  onChange,
}: {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium text-muted">
      문단
      <textarea
        className={`${fieldClassName} min-h-28 resize-y`}
        value={block.content.text}
        onChange={(event) =>
          onChange({
            ...block,
            content: { text: event.target.value },
          })
        }
      />
    </label>
  );
}

function ImageControls({
  block,
  onChange,
}: {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}) {
  const updateContent = (content: Partial<ImageBlock["content"]>) =>
    onChange({ ...block, content: { ...block.content, ...content } });

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-xs font-medium text-muted">
        이미지 URL
        <input
          className={fieldClassName}
          value={block.content.src}
          onChange={(event) => updateContent({ src: event.target.value })}
        />
      </label>
      <label className="grid gap-2 text-xs font-medium text-muted">
        대체 텍스트
        <input
          className={fieldClassName}
          value={block.content.alt}
          onChange={(event) => updateContent({ alt: event.target.value })}
        />
      </label>
      <label className="grid gap-2 text-xs font-medium text-muted">
        캡션
        <input
          className={fieldClassName}
          value={block.content.caption ?? ""}
          onChange={(event) => updateContent({ caption: event.target.value })}
        />
      </label>
    </div>
  );
}

function BlockControls({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "title":
      return <TitleControls block={block} onChange={onChange} />;
    case "paragraph":
      return <ParagraphControls block={block} onChange={onChange} />;
    case "image":
      return <ImageControls block={block} onChange={onChange} />;
  }
}

export function BlockEditor({
  initialDocument,
  initialMetadata,
  publicationStatus = "draft",
  onSave,
  onPublish,
  onUnpublish,
}: {
  initialDocument: ContentDocument;
  initialMetadata: EditorPostMetadata;
  publicationStatus?: "draft" | "published";
  onSave?: (value: EditorPostValue) => Promise<void>;
  onPublish?: (value: EditorPostValue) => Promise<void>;
  onUnpublish?: (value: EditorPostValue) => Promise<void>;
}) {
  const [document, setDocument] = useState<ContentDocument>(() => ({
    ...initialDocument,
    blocks: [...initialDocument.blocks],
  }));
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState(initialMetadata);

  const runAction = (
    action: ((value: EditorPostValue) => Promise<void>) | undefined,
    successMessage: string,
  ) => {
    if (!action) return;
    setMessage(null);
    startTransition(async () => {
      try {
        await action({ document, metadata });
        setMessage(successMessage);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "작업을 완료하지 못했습니다.",
        );
      }
    });
  };

  const updateBlock = (nextBlock: ContentBlock) => {
    setDocument((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === nextBlock.id ? nextBlock : block,
      ),
    }));
  };

  const addBlock = (type: BlockType) => {
    setDocument((current) => ({
      ...current,
      blocks: [...current.blocks, createBlock(type)],
    }));
  };

  const removeBlock = (id: string) => {
    setDocument((current) => ({
      ...current,
      blocks: current.blocks.filter((block) => block.id !== id),
    }));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    setDocument((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.blocks.length) {
        return current;
      }

      const blocks = [...current.blocks];
      const selected = blocks[index];
      const displaced = blocks[destination];
      if (!selected || !displaced) return current;
      blocks[index] = displaced;
      blocks[destination] = selected;

      return { ...current, blocks };
    });
  };

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 xl:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]">
      <section className="rounded-3xl border bg-paper p-5 shadow-[0_24px_80px_rgba(24,24,22,0.05)] sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
              Editor
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              글 블록 편집
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-canvas px-3 py-1.5 text-xs text-muted">
              {publicationStatus === "published" ? "발행됨" : "초안"}
            </span>
            <span className="rounded-full bg-canvas px-3 py-1.5 text-xs text-muted">
              {document.blocks.length}개
            </span>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border bg-canvas/70 p-4">
          <label className="grid gap-2 text-xs font-medium text-muted">
            글 제목
            <input
              className={fieldClassName}
              value={metadata.title}
              onChange={(event) =>
                setMetadata((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
          </label>
          <label className="grid gap-2 text-xs font-medium text-muted">
            Slug
            <input
              className={fieldClassName}
              value={metadata.slug}
              onChange={(event) =>
                setMetadata((current) => ({
                  ...current,
                  slug: event.target.value,
                }))
              }
              placeholder="my-post-slug"
            />
          </label>
          <label className="grid gap-2 text-xs font-medium text-muted">
            요약
            <textarea
              className={`${fieldClassName} min-h-20 resize-y`}
              value={metadata.excerpt}
              onChange={(event) =>
                setMetadata((current) => ({
                  ...current,
                  excerpt: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {(Object.keys(blockNames) as BlockType[]).map((type) => (
            <button
              key={type}
              className="rounded-xl border bg-canvas px-3 py-2.5 text-sm font-medium transition hover:border-ink hover:bg-paper"
              type="button"
              onClick={() => addBlock(type)}
            >
              + {blockNames[type]}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          <AnimatePresence initial={false}>
            {document.blocks.map((block, index) => (
              <motion.div
                layout
                key={block.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl border bg-canvas/70 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <strong className="text-sm">{blockNames[block.type]}</strong>
                  <div className="flex gap-1.5">
                    <button
                      className={smallButtonClassName}
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveBlock(index, -1)}
                      aria-label={`${blockNames[block.type]} 블록 위로 이동`}
                    >
                      ↑
                    </button>
                    <button
                      className={smallButtonClassName}
                      type="button"
                      disabled={index === document.blocks.length - 1}
                      onClick={() => moveBlock(index, 1)}
                      aria-label={`${blockNames[block.type]} 블록 아래로 이동`}
                    >
                      ↓
                    </button>
                    <button
                      className={`${smallButtonClassName} hover:border-red-500 hover:text-red-600`}
                      type="button"
                      onClick={() => removeBlock(block.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <BlockControls block={block} onChange={updateBlock} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <details className="mt-5 rounded-2xl border bg-canvas/70 p-4">
          <summary className="cursor-pointer text-sm font-medium">
            저장될 JSON 확인
          </summary>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted">
            {JSON.stringify(document, null, 2)}
          </pre>
        </details>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-5">
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(onSave, "초안을 저장했습니다.")}
            className="rounded-xl border bg-paper px-4 py-2.5 text-sm font-semibold transition hover:border-ink disabled:opacity-50"
          >
            초안 저장
          </button>
          {publicationStatus === "published" ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction(onUnpublish, "발행을 취소했습니다.")}
              className="rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-50"
            >
              발행 취소
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction(onPublish, "글을 발행했습니다.")}
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-80 disabled:opacity-50"
            >
              저장하고 발행
            </button>
          )}
          {message ? (
            <p className="text-sm text-muted" role="status">
              {message}
            </p>
          ) : null}
        </div>
      </section>

      <section className="min-w-0 xl:sticky xl:top-6 xl:self-start">
        <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
          Live preview · client와 동일한 renderer
        </p>
        <BlockRenderer document={document} />
      </section>
    </div>
  );
}
