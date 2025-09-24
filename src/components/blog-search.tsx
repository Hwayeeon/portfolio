"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnhancedBlogPost } from "@/lib/blog-utils";

interface BlogSearchProps {
  posts: EnhancedBlogPost[];
  onFilteredPosts: (posts: EnhancedBlogPost[]) => void;
  className?: string;
}

export function BlogSearch({ posts, onFilteredPosts, className }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Search posts based on query
  const filteredPosts = useMemo(() => {
    if (!query.trim()) {
      return posts;
    }

    const searchQuery = query.toLowerCase().trim();

    return posts.filter((post) => {
      // Search in title
      if (post.metadata.title.toLowerCase().includes(searchQuery)) {
        return true;
      }

      // Search in summary
      if (post.metadata.summary?.toLowerCase().includes(searchQuery)) {
        return true;
      }

      // Search in categories
      if (
        post.metadata.categories?.some((category) => category.toLowerCase().includes(searchQuery))
      ) {
        return true;
      }

      // Search in tags
      if (post.metadata.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))) {
        return true;
      }

      // Search in content (basic search)
      if (post.content.toLowerCase().includes(searchQuery)) {
        return true;
      }

      return false;
    });
  }, [posts, query]);

  // Update parent component with filtered posts
  useMemo(() => {
    onFilteredPosts(filteredPosts);
  }, [filteredPosts, onFilteredPosts]);

  const handleClearSearch = () => {
    setQuery("");
    setIsSearchActive(false);
  };

  const handleInputFocus = () => {
    setIsSearchActive(true);
  };

  const handleInputBlur = () => {
    if (!query) {
      setIsSearchActive(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={cn(
            "border-border bg-background w-full rounded-lg border py-2.5 pr-10 pl-10 text-sm",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none",
            "transition-all duration-200",
            isSearchActive && "shadow-sm"
          )}
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-0.5 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Summary */}
      {query && (
        <div className="text-muted-foreground mt-2 text-sm">
          {filteredPosts.length === 0 ? (
            <span>No posts found for &quot;{query}&quot;</span>
          ) : (
            <span>
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
              {filteredPosts.length !== posts.length && ` for "${query}"`}
            </span>
          )}
        </div>
      )}

      {/* Search Suggestions (when focused but no query) */}
      {isSearchActive && !query && (
        <div className="border-border bg-background absolute top-full right-0 left-0 z-10 mt-1 rounded-lg border shadow-lg">
          <div className="p-3">
            <div className="text-muted-foreground mb-2 text-xs tracking-wide uppercase">
              Popular searches
            </div>
            <div className="flex flex-wrap gap-1">
              {["react", "typescript", "nextjs", "performance", "architecture"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      setIsSearchActive(false);
                    }}
                    className="bg-muted hover:bg-muted/80 rounded px-2 py-1 text-xs transition-colors"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
