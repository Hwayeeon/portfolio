"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { List, ChevronRight } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
  maxLevel?: number;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TableOfContents({ content, className, maxLevel = 4 }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract headings from content
  const headings = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];

    return matches
      .map(([, hashes, title]) => {
        if (!hashes || !title) return null;
        return {
          id: slugify(title.trim()),
          title: title.trim(),
          level: hashes.length,
        };
      })
      .filter((heading): heading is TocItem => heading !== null)
      .filter((heading) => heading.level <= maxLevel);
  }, [content, maxLevel]);

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((heading) => ({
          id: heading.id,
          element: document.getElementById(heading.id),
        }))
        .filter(({ element }) => element !== null);

      // Find the currently visible heading
      let currentHeading = "";
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      for (const { id, element } of headingElements) {
        const rect = element!.getBoundingClientRect();
        const offsetTop = rect.top + scrollY;

        // Check if heading is in view or passed
        if (offsetTop <= scrollY + windowHeight / 3) {
          currentHeading = id;
        } else {
          break;
        }
      }

      setActiveId(currentHeading);
    };

    // Set initial active heading
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
      const adjustedTop = offsetTop - 80; // Account for sticky header

      window.scrollTo({
        top: adjustedTop,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List className="text-muted-foreground h-4 w-4" />
          <h3 className="text-sm font-medium">Table of Contents</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
          aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
        >
          <ChevronRight
            className={cn("h-4 w-4 transition-transform", !isCollapsed && "rotate-90")}
          />
        </button>
      </div>

      {/* Table of Contents List */}
      {!isCollapsed && (
        <nav className="space-y-1">
          <ul className="space-y-1 text-sm">
            {headings.map((heading) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "hover:text-foreground block w-full text-left transition-colors",
                    activeId === heading.id ? "text-primary font-medium" : "text-muted-foreground"
                  )}
                >
                  <span className="line-clamp-2 break-words">{heading.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Progress indicator */}
      {!isCollapsed && (
        <div className="border-t pt-2">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>Reading progress</span>
            <span>
              {headings.findIndex((h) => h.id === activeId) + 1}/{headings.length}
            </span>
          </div>
          <div className="bg-muted mt-1 h-1 rounded-full">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{
                width: `${
                  activeId
                    ? ((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
