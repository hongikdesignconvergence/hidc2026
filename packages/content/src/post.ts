import type { ContentDocument } from "@repo/blocks/types";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: PostStatus;
  document: ContentDocument;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type PostListItem = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "status"
  | "updatedAt"
  | "publishedAt"
>;

export type PostListOptions = {
  status?: PostStatus;
};

export interface PostRepository {
  list(options?: PostListOptions): Promise<PostListItem[]>;
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  save(post: Post): Promise<Post>;
  publish(id: string): Promise<Post>;
  unpublish(id: string): Promise<Post>;
}
