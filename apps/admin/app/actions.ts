"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { posts } from "../lib/posts";

export async function createPost() {
  const id = `post-${randomUUID()}`;
  const slug = `untitled-${Date.now()}`;
  const now = new Date().toISOString();

  await posts.save({
    id,
    title: "제목 없는 글",
    slug,
    excerpt: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    document: {
      version: 1,
      blocks: [
        {
          id: `title-${randomUUID()}`,
          type: "title",
          content: { text: "제목 없는 글" },
        },
        {
          id: `paragraph-${randomUUID()}`,
          type: "paragraph",
          content: { text: "첫 문단을 입력하세요." },
        },
      ],
    },
  });

  redirect(`/posts/${id}`);
}
