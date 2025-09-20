import { getBlogPosts } from "@/app/blog/utils";
import { PostList } from "./post-list";
import type { EnhancedBlogPost } from "@/lib/blog-utils";

// Server Component - fetches data
export function BlogPosts() {
  const allBlogs = getBlogPosts();

  // Transform to EnhancedBlogPost format
  const enhancedBlogs: EnhancedBlogPost[] = allBlogs.map((blog) => ({
    ...blog,
    metadata: {
      ...blog.metadata,
      categories: blog.metadata.categories || [],
      tags: blog.metadata.tags || [],
      thumbnailUrl: blog.metadata.thumbnailUrl,
      images: blog.metadata.images || [],
    },
  }));

  // Pass data to client component
  return <PostList posts={enhancedBlogs} />;
}
