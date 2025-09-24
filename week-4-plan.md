# Week 4 Implementation Plan: Polish & Testing

## 1. Refactor Theme Management to Context

### Current Issue:

- Theme state scattered across components
- Potential hydration mismatches
- No global theme context

### Implementation:

```typescript
// src/contexts/theme-context.tsx
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('theme', 'system');

  const resolvedTheme = useMemo(() => {
    if (typeof window === 'undefined') return 'light';

    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Enhanced Theme Toggle:

```typescript
// Updated theme-toggle.tsx
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === 'light' ? <Sun /> : theme === 'dark' ? <Moon /> : <Monitor />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map(option => (
          <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
            <option.icon className="mr-2 h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## 2. Add Proper Error Boundaries

### Global Error Boundary Enhancement:

```typescript
// src/app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Component-Level Error Boundaries:

```typescript
// src/components/blog-error-boundary.tsx
export const BlogErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    fallback={
      <div className="border border-destructive/20 rounded-lg p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <h3 className="font-semibold mb-2">Failed to load blog posts</h3>
        <p className="text-sm text-muted-foreground">
          There was an error loading the content. Please refresh the page.
        </p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);
```

## 3. Comprehensive Testing Setup

### Component Testing with Vitest:

```typescript
// src/__tests__/components/blog-search.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BlogSearch } from '@/components/blog-search';

describe('BlogSearch', () => {
  const mockPosts = [
    {
      slug: 'test-post',
      metadata: {
        title: 'Test Post',
        summary: 'Test summary',
        categories: ['tech'],
        tags: ['react'],
      },
      content: 'Test content about React',
    },
  ];

  it('filters posts by search query', async () => {
    const onFilteredPosts = jest.fn();
    render(<BlogSearch posts={mockPosts} onFilteredPosts={onFilteredPosts} />);

    const searchInput = screen.getByPlaceholderText('Search posts...');
    fireEvent.change(searchInput, { target: { value: 'react' } });

    await waitFor(() => {
      expect(onFilteredPosts).toHaveBeenCalledWith([mockPosts[0]]);
    });
  });
});
```

### E2E Testing with Playwright:

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages correctly", async ({ page }) => {
    await page.goto("/");

    // Test blog navigation
    await page.click('[href="/blog"]');
    await expect(page).toHaveURL("/blog");
    await expect(page.locator("h1")).toContainText("Blog");

    // Test projects navigation
    await page.click('[href="/projects"]');
    await expect(page).toHaveURL("/projects");
    await expect(page.locator("h1")).toContainText("Projects");

    // Test search functionality
    await page.goto("/blog");
    await page.fill('[placeholder="Search posts..."]', "react");
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });
});
```

## 4. Performance Monitoring Dashboard

### Real User Metrics Collection:

```typescript
// src/lib/analytics.ts
export const Analytics = {
  trackPageView: (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID", {
        page_path: url,
      });
    }
  },

  trackEvent: (action: string, parameters?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, parameters);
    }
  },

  trackWebVitals: ({ name, value, id }: { name: string; value: number; id: string }) => {
    window.gtag?.("event", name, {
      event_category: "Web Vitals",
      event_label: id,
      value: Math.round(name === "CLS" ? value * 1000 : value),
      non_interaction: true,
    });
  },
};
```

### Performance Monitoring Component:

```typescript
// Enhanced src/components/performance-monitor.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // Track all Core Web Vitals
      getCLS(Analytics.trackWebVitals);
      getFID(Analytics.trackWebVitals);
      getFCP(Analytics.trackWebVitals);
      getLCP(Analytics.trackWebVitals);
      getTTFB(Analytics.trackWebVitals);
    }
  }, []);

  return null;
}
```

## Timeline:

- **Day 1-2**: Theme context refactoring
- **Day 3-4**: Error boundaries implementation
- **Day 5-6**: Testing setup and writing tests
- **Day 7**: Performance monitoring and analytics

## Success Metrics:

- Theme switching works flawlessly across all devices
- Error boundaries catch and gracefully handle all error scenarios
- 80%+ test coverage for critical components
- Real user metrics successfully collected and analyzed

## Final Production Checklist:

- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Lighthouse score 95+ on all metrics
- [ ] Error boundaries in place
- [ ] Analytics and monitoring active
- [ ] Security headers implemented
- [ ] Performance optimizations applied
- [ ] SEO metadata complete
- [ ] RSS feed functional
- [ ] All features tested on mobile and desktop
