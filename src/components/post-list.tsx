"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostCard, PostCardSkeleton } from "./post-card";
import { BlogSearch } from "./blog-search";
import { getAllCategories, filterPostsByCategory, type EnhancedBlogPost } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";
import { Filter, Grid, List } from "lucide-react";

interface PostListProps {
  posts: EnhancedBlogPost[];
  showFilter?: boolean;
  showLayoutToggle?: boolean;
  showSearch?: boolean;
  initialLayout?: "default" | "square";
}

export function PostList({
  posts,
  showFilter = true,
  showLayoutToggle = true,
  showSearch = true,
  initialLayout = "default",
}: PostListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [layout, setLayout] = useState<"default" | "square">(initialLayout);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilteredPosts, setSearchFilteredPosts] = useState<EnhancedBlogPost[]>(posts);

  // Get category from URL params on mount
  useEffect(() => {
    if (searchParams) {
      const categoryParam = searchParams.get("category");
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
    }
  }, [searchParams]);

  // Get all unique categories
  const categories = useMemo(() => getAllCategories(posts), [posts]);

  // Handle search results from BlogSearch component
  const handleSearchResults = useCallback((filtered: EnhancedBlogPost[]) => {
    setSearchFilteredPosts(filtered);
  }, []);

  // Filter posts based on selected category (from search results)
  const filteredPosts = useMemo(
    () => filterPostsByCategory(searchFilteredPosts, selectedCategory),
    [searchFilteredPosts, selectedCategory]
  );

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);

    // Update URL with new category
    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }

    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 150);
  };

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {showSearch && (
        <BlogSearch posts={posts} onFilteredPosts={handleSearchResults} className="mb-6" />
      )}

      {/* Filter and Layout Controls */}
      {(showFilter || showLayoutToggle) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Filter */}
          {showFilter && categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4" />
                <span>Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  All ({searchFilteredPosts.length})
                </button>
                {categories.map((category) => {
                  const count = searchFilteredPosts.filter((post) =>
                    post.metadata.categories?.includes(category)
                  ).length;

                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Layout Toggle */}
          {showLayoutToggle && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Layout:</span>
              <div className="border-border flex rounded-md border">
                <button
                  onClick={() => setLayout("default")}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 text-sm transition-colors",
                    layout === "default"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="h-3 w-3" />
                  Default
                </button>
                <button
                  onClick={() => setLayout("square")}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 text-sm transition-colors",
                    layout === "square"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Grid className="h-3 w-3" />
                  Grid
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-muted-foreground text-sm">
        {selectedCategory === "all"
          ? `Showing all ${filteredPosts.length} posts`
          : `Showing ${filteredPosts.length} posts in "${selectedCategory}"`}
      </div>

      {/* Posts Grid/List */}
      {isLoading ? (
        <div
          className={cn(
            "grid gap-6",
            layout === "square"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-2"
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} layout={layout} />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div
          className={cn(
            "grid gap-6",
            layout === "square"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-2"
          )}
        >
          {filteredPosts
            .sort((a, b) => {
              const dateA = new Date(a.metadata.publishedAt);
              const dateB = new Date(b.metadata.publishedAt);
              return dateB.getTime() - dateA.getTime();
            })
            .map((post, index) => (
              <PostCard
                key={post.slug}
                post={post}
                layout={layout}
                priority={index < 2} // Prioritize first 2 images for LCP
              />
            ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No posts found in the &quot;{selectedCategory}&quot; category.
          </p>
          <button
            onClick={() => handleCategoryChange("all")}
            className="text-primary mt-2 text-sm hover:underline"
          >
            View all posts
          </button>
        </div>
      )}
    </div>
  );
}
