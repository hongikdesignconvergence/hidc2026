import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
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

export class FilePostRepository implements PostRepository {
  constructor(
    private readonly filePath: string,
    private readonly fallbackPosts: Post[] = [],
  ) {}

  async list(options: PostListOptions = {}): Promise<PostListItem[]> {
    const posts = await this.readPosts();
    return posts
      .filter((post) => !options.status || post.status === options.status)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(toListItem);
  }

  async findById(id: string): Promise<Post | null> {
    const post = (await this.readPosts()).find((item) => item.id === id);
    return post ? clonePost(post) : null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = (await this.readPosts()).find((item) => item.slug === slug);
    return post ? clonePost(post) : null;
  }

  async save(post: Post): Promise<Post> {
    const posts = await this.readPosts();
    const slugOwner = posts.find(
      (item) => item.slug === post.slug && item.id !== post.id,
    );
    if (slugOwner) throw new Error(`이미 사용 중인 slug입니다: ${post.slug}`);

    const savedPost = clonePost({
      ...post,
      updatedAt: new Date().toISOString(),
    });
    const existingIndex = posts.findIndex((item) => item.id === post.id);
    if (existingIndex === -1) posts.push(savedPost);
    else posts[existingIndex] = savedPost;

    await this.writePosts(posts);
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
    const posts = await this.readPosts();
    const index = posts.findIndex((post) => post.id === id);
    const post = posts[index];
    if (!post) throw new Error(`글을 찾을 수 없습니다: ${id}`);

    const now = new Date().toISOString();
    const savedPost = clonePost({
      ...post,
      status,
      updatedAt: now,
      publishedAt: status === "published" ? now : null,
    });
    posts[index] = savedPost;
    await this.writePosts(posts);
    return clonePost(savedPost);
  }

  private async readPosts(): Promise<Post[]> {
    try {
      const source = await readFile(this.filePath, "utf8");
      return (JSON.parse(source) as Post[]).map(clonePost);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return this.fallbackPosts.map(clonePost);
      }
      throw error;
    }
  }

  private async writePosts(posts: Post[]) {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
    await rename(temporaryPath, this.filePath);
  }
}

export function createFilePostRepository(
  filePath: string,
  fallbackPosts: Post[] = [],
) {
  return new FilePostRepository(filePath, fallbackPosts);
}
