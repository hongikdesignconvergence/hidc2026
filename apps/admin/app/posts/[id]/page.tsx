import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockEditor } from "@repo/editor";
import { posts } from "../../../lib/posts";
import {
  publishPostDocument,
  savePostDocument,
  unpublishPostDocument,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await posts.findById(id);
  if (!post) notFound();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto mb-5 flex w-full max-w-[1600px] items-center justify-between gap-4">
        <Link className="text-sm text-muted hover:text-ink" href="/">
          ← 글 목록
        </Link>
        <p className="truncate text-sm font-medium">{post.title}</p>
      </div>
      <BlockEditor
        initialDocument={post.document}
        initialMetadata={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
        }}
        publicationStatus={post.status}
        onSave={savePostDocument.bind(null, post.id)}
        onPublish={publishPostDocument.bind(null, post.id)}
        onUnpublish={unpublishPostDocument.bind(null, post.id)}
      />
    </main>
  );
}
