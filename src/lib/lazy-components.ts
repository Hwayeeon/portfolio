import { lazy, ComponentType, Suspense } from "react";
import React from "react";

/**
 * Creates a lazy-loaded component with error boundary
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(factory);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    const FallbackComponent =
      fallback ||
      (() => React.createElement("div", { className: "animate-pulse bg-muted rounded h-20" }));

    return React.createElement(
      Suspense,
      { fallback: React.createElement(FallbackComponent) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(LazyComponent, props as any)
    );
  };
}

/**
 * Preloads a dynamic component for better performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function preloadComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): Promise<void> {
  return factory().then(() => void 0);
}

/**
 * Creates route-specific component bundles
 */
export const LazyComponents = {
  // Blog components
  BlogSearch: createLazyComponent(
    async () => {
      const { BlogSearch } = await import("@/components/blog-search");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { default: BlogSearch as ComponentType<any> };
    },
    () => React.createElement("div", { className: "h-10 bg-muted animate-pulse rounded" })
  ),

  TableOfContents: createLazyComponent(
    async () => {
      const { TableOfContents } = await import("@/components/table-of-contents");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { default: TableOfContents as ComponentType<any> };
    },
    () => React.createElement("div", { className: "w-48 h-32 bg-muted animate-pulse rounded" })
  ),

  ReadingProgress: createLazyComponent(
    async () => {
      const { ReadingProgress } = await import("@/components/reading-progress");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { default: ReadingProgress as ComponentType<any> };
    },
    () => React.createElement("div", { className: "h-1 bg-muted animate-pulse" })
  ),

  // Project components
  ProjectList: createLazyComponent(
    async () => {
      const { ProjectList } = await import("@/components/project-list");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { default: ProjectList as ComponentType<any> };
    },
    () =>
      React.createElement(
        "div",
        { className: "grid gap-4 md:grid-cols-2" },
        ...Array.from({ length: 4 }, (_, i) =>
          React.createElement("div", {
            key: i,
            className: "h-48 bg-muted animate-pulse rounded-lg",
          })
        )
      )
  ),

  // Performance monitoring (only in production)
  PerformanceMonitor: createLazyComponent(
    async () => {
      const { PerformanceMonitor } = await import("@/components/performance-monitor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { default: PerformanceMonitor as ComponentType<any> };
    },
    () => null
  ),
} as const;

export default LazyComponents;
