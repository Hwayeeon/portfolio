/**
 * Blog service - centralized logic for blog operations
 * Improves maintainability and provides caching
 */

import { getBlogPosts, getBlogPostBySlug, type BlogPost } from "@/app/blog/utils";
import { SimpleCache } from "@/lib/performance";

// Service-level caches for different data types
const postCache = new SimpleCache<BlogPost>(15 * 60 * 1000);
const postsListCache = new SimpleCache<BlogPost[]>(15 * 60 * 1000);
const statsCache = new SimpleCache<{
  totalPosts: number;
  totalWords: number;
  averageReadingTime: number;
}>(15 * 60 * 1000);

export class BlogService {
  /**
   * Get all blog posts with caching
   */
  static getAllPosts(): BlogPost[] {
    return getBlogPosts();
  }

  /**
   * Get blog post by slug with caching
   */
  static getPostBySlug(slug: string): BlogPost | null {
    const cacheKey = `post-${slug}`;
    const cached = postCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const post = getBlogPostBySlug(slug);
    if (post) {
      postCache.set(cacheKey, post);
      return post;
    }

    return null;
  }

  /**
   * Get latest posts with efficient slicing
   */
  static getLatestPosts(limit: number = 4): BlogPost[] {
    const cacheKey = `latest-${limit}`;
    const cached = postsListCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const allPosts = this.getAllPosts();
    const sortedPosts = allPosts
      .sort((a, b) => {
        const dateA = new Date(a.metadata.publishedAt);
        const dateB = new Date(b.metadata.publishedAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);

    postsListCache.set(cacheKey, sortedPosts);
    return sortedPosts;
  }

  /**
   * Get posts by category with caching
   */
  static getPostsByCategory(category: string): BlogPost[] {
    const cacheKey = `category-${category}`;
    const cached = postsListCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const allPosts = this.getAllPosts();
    const filteredPosts = allPosts.filter((post) => post.metadata.categories?.includes(category));

    postsListCache.set(cacheKey, filteredPosts);
    return filteredPosts;
  }

  /**
   * Get reading stats for all posts
   */
  static getReadingStats(): { totalPosts: number; totalWords: number; averageReadingTime: number } {
    const cacheKey = "reading-stats";
    const cached = statsCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const allPosts = this.getAllPosts();
    const totalWords = allPosts.reduce((sum, post) => sum + post.readingTime.words, 0);
    const averageReadingTime =
      allPosts.length > 0
        ? Math.round(totalWords / allPosts.length / 200) // ~200 WPM average
        : 0;

    const stats = {
      totalPosts: allPosts.length,
      totalWords,
      averageReadingTime,
    };

    statsCache.set(cacheKey, stats);
    return stats;
  }

  /**
   * Clear all service-level caches
   */
  static clearCache(): void {
    postCache.clear();
    postsListCache.clear();
    statsCache.clear();
  }
}
