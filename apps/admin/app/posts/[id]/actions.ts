"use server";

import { revalidatePath } from "next/cache";
import type { EditorPostValue } from "@repo/editor";
import { posts } from "../../../lib/posts";

function validateMetadata(value: EditorPostValue) {
  const title = value.metadata.title.trim();
  const slug = value.metadata.slug.trim();
  const excerpt = value.metadata.excerpt.trim();

  if (!title) throw new Error("글 제목을 입력해주세요.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }

  return { title, slug, excerpt };
}

async function saveValue(id: string, value: EditorPostValue) {
  const post = await posts.findById(id);
  if (!post) throw new Error("글을 찾을 수 없습니다.");
  const metadata = validateMetadata(value);
  const savedPost = await posts.save({
    ...post,
    ...metadata,
    document: value.document,
  });
  return { post: savedPost, previousSlug: post.slug };
}

function refreshPostRoutes(id: string, slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  revalidatePath(`/posts/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/posts/${previousSlug}`);
  }
}

export async function savePostDocument(id: string, value: EditorPostValue) {
  const { post, previousSlug } = await saveValue(id, value);
  refreshPostRoutes(id, post.slug, previousSlug);
}

export async function publishPostDocument(
  id: string,
  value: EditorPostValue,
) {
  const { previousSlug } = await saveValue(id, value);
  const post = await posts.publish(id);
  refreshPostRoutes(id, post.slug, previousSlug);
}

export async function unpublishPostDocument(
  id: string,
  value: EditorPostValue,
) {
  const { previousSlug } = await saveValue(id, value);
  const post = await posts.unpublish(id);
  refreshPostRoutes(id, post.slug, previousSlug);
}
