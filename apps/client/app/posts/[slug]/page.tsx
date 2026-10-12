import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@repo/blocks";
import { posts } from "../../../lib/posts";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await posts.findBySlug(slug);
  if (!post || post.status !== "published") notFound();

  return (
    <main className="min-h-screen px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto mb-4 max-w-4xl">
        <Link className="text-sm text-muted hover:text-ink" href="/">
          ← 글 목록
        </Link>
      </div>
      <BlockRenderer document={post.document} />
    </main>
  );
}
