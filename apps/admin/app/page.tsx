import Link from "next/link";
import { Container } from "@repo/ui/container";
import { posts } from "../lib/posts";
import { createPost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const allPosts = await posts.list();

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 sm:py-16">
      <Container>
        <header className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
              HIDC CMS
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
              글 관리
            </h1>
          </div>
          <form action={createPost}>
            <button
              type="submit"
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-80"
            >
              새 글 작성
            </button>
          </form>
        </header>

        <div className="overflow-hidden rounded-2xl border bg-paper">
          {allPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex items-center justify-between gap-6 border-b px-5 py-5 transition last:border-b-0 hover:bg-canvas"
            >
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{post.title}</h2>
                <p className="mt-1 truncate text-sm text-muted">/{post.slug}</p>
              </div>
              <span className="shrink-0 rounded-full bg-canvas px-3 py-1.5 text-xs text-muted">
                {post.status === "published" ? "발행됨" : "초안"}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
