import type {
  Post,
  PostListItem,
  PostListOptions,
  PostRepository,
} from "./post";

function clonePost(post: Post): Post {
  return structuredClone(post);
}

function toListItem(post: Post): PostListItem {
  const { id, title, slug, excerpt, status, updatedAt, publishedAt } = post;
  return { id, title, slug, excerpt, status, updatedAt, publishedAt };
}

export class LocalPostRepository implements PostRepository {
  private readonly posts = new Map<string, Post>();

  constructor(initialPosts: Post[] = []) {
    for (const post of initialPosts) {
      this.posts.set(post.id, clonePost(post));
    }
  }

  async list(options: PostListOptions = {}): Promise<PostListItem[]> {
    return [...this.posts.values()]
      .filter((post) => !options.status || post.status === options.status)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(toListItem);
  }

  async findById(id: string): Promise<Post | null> {
    const post = this.posts.get(id);
    return post ? clonePost(post) : null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = [...this.posts.values()].find((item) => item.slug === slug);
    return post ? clonePost(post) : null;
  }

  async save(post: Post): Promise<Post> {
    const slugOwner = [...this.posts.values()].find(
      (item) => item.slug === post.slug && item.id !== post.id,
    );

    if (slugOwner) {
      throw new Error(`이미 사용 중인 slug입니다: ${post.slug}`);
    }

    const savedPost = clonePost({
      ...post,
      updatedAt: new Date().toISOString(),
    });
    this.posts.set(savedPost.id, savedPost);
    return clonePost(savedPost);
  }

  async publish(id: string): Promise<Post> {
    return this.changeStatus(id, "published");
  }

  async unpublish(id: string): Promise<Post> {
    return this.changeStatus(id, "draft");
  }

  private async changeStatus(
    id: string,
    status: Post["status"],
  ): Promise<Post> {
    const post = this.posts.get(id);
    if (!post) throw new Error(`글을 찾을 수 없습니다: ${id}`);

    const now = new Date().toISOString();
    const savedPost = clonePost({
      ...post,
      status,
      updatedAt: now,
      publishedAt: status === "published" ? now : null,
    });
    this.posts.set(id, savedPost);
    return clonePost(savedPost);
  }
}

export function createLocalPostRepository(initialPosts: Post[] = []) {
  return new LocalPostRepository(initialPosts);
}
