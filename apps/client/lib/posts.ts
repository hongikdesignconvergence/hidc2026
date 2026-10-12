import "server-only";

import { resolve } from "node:path";
import { createFilePostRepository } from "@repo/content/file";
import { samplePosts } from "@repo/content/sample-posts";

export const posts = createFilePostRepository(
  resolve(process.cwd(), "../../packages/content/data/posts.json"),
  samplePosts,
);
