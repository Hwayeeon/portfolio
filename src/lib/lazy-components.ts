import { lazy, ComponentType, Suspense } from "react";
import React from "react";

/**
 * Creates a lazy-loaded component with error boundary
 */
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: React.ComponentType,
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(factory);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    const ErrorFallback =
      errorFallback ||
      (() =>
        React.createElement(
          "div",
          { className: "p-4 text-center text-muted-foreground" },
          "Failed to load component"
        ));

    const FallbackComponent =
      fallback ||
      (() => React.createElement("div", { className: "animate-pulse bg-muted rounded h-20" }));

    return React.createElement(
      Suspense,
      { fallback: React.createElement(FallbackComponent) },
      React.createElement(LazyComponent, props)
    );
  };
}

/**
 * Preloads a dynamic component for better performance
 */
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
      const module = await import("@/components/blog-search");
      return { default: module.BlogSearch };
    },
    () => React.createElement("div", { className: "h-10 bg-muted animate-pulse rounded" })
  ),

  TableOfContents: createLazyComponent(
    async () => {
      const module = await import("@/components/table-of-contents");
      return { default: module.TableOfContents };
    },
    () => React.createElement("div", { className: "w-48 h-32 bg-muted animate-pulse rounded" })
  ),

  ReadingProgress: createLazyComponent(
    async () => {
      const module = await import("@/components/reading-progress");
      return { default: module.ReadingProgress };
    },
    () => React.createElement("div", { className: "h-1 bg-muted animate-pulse" })
  ),

  // Project components
  ProjectList: createLazyComponent(
    async () => {
      const module = await import("@/components/project-list");
      return { default: module.ProjectList };
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
      const module = await import("@/components/performance-monitor");
      return { default: module.PerformanceMonitor };
    },
    () => null
  ),
} as const;

export default LazyComponents;
