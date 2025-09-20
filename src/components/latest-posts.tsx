import { getBlogPosts } from "@/app/blog/utils";
import { PostCard } from "./post-card";
import type { EnhancedBlogPost } from "@/lib/blog-utils";

// Server Component - simple post list for home page (no filtering)
export function LatestPosts({ limit = 3 }: { limit?: number }) {
  const allBlogs = getBlogPosts();

  // Transform to EnhancedBlogPost format and limit results
  const enhancedBlogs: EnhancedBlogPost[] = allBlogs
    .sort((a, b) => {
      const dateA = new Date(a.metadata.publishedAt);
      const dateB = new Date(b.metadata.publishedAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit)
    .map((blog) => ({
      ...blog,
      metadata: {
        ...blog.metadata,
        categories: blog.metadata.categories || [],
        tags: blog.metadata.tags || [],
        thumbnailUrl: blog.metadata.thumbnailUrl,
        images: blog.metadata.images || [],
      },
    }));

  if (enhancedBlogs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {enhancedBlogs.map((post, index) => (
        <PostCard
          key={post.slug}
          post={post}
          priority={index === 0} // Prioritize first image for LCP
        />
      ))}
    </div>
  );
}
