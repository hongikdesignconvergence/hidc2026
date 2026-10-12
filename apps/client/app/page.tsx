import Link from "next/link";
import { Container } from "@repo/ui/container";
import { posts } from "../lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publishedPosts = await posts.list({ status: "published" });

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 sm:py-20">
      <Container>
        <header className="mb-14">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            HIDC Journal
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            글과 프로젝트
          </h1>
        </header>

        <div className="grid gap-4">
          {publishedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group rounded-2xl border bg-paper p-6 transition hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_16px_48px_rgba(24,24,22,0.06)]"
            >
              <h2 className="text-2xl font-semibold tracking-tight group-hover:underline">
                {post.title}
              </h2>
              <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
              <p className="mt-5 text-xs text-muted">
                {post.publishedAt
                  ? new Intl.DateTimeFormat("ko-KR", {
                      dateStyle: "long",
                    }).format(new Date(post.publishedAt))
                  : null}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
