import { BlogService } from "@/services/blog-service";
import { PostCard } from "./post-card";
import type { EnhancedBlogPost } from "@/lib/blog-utils";

// Server Component - optimized post list for home page
export function LatestPosts({ limit = 3 }: { limit?: number }) {
  const latestBlogs = BlogService.getLatestPosts(limit);

  // Transform to EnhancedBlogPost format
  const enhancedBlogs: EnhancedBlogPost[] = latestBlogs.map((blog) => ({
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
