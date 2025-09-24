# Hydration Issue Prevention Guide

## Common Hydration Mismatch Causes

### 1. ClassName Ordering Issues ✅ FIXED

**Problem**: Tailwind CSS classes being reordered differently between server and client
**Solution**: Use consistent className ordering (alphabetical within semantic groups)

**Example Fix:**

```tsx
// ❌ Prone to hydration mismatch
className = "text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2";

// ✅ Stable ordering
className = "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground";
```

### 2. Client-Only Logic

**Problem**: Using `typeof window !== 'undefined'` or other client-only checks
**Solution**: Use `useEffect` or `useIsomorphicLayoutEffect` for client-only code

### 3. Random Values or Timestamps

**Problem**: `Date.now()`, `Math.random()`, or similar values that change between renders
**Solution**: Move to `useEffect` or use stable server-side values

### 4. Conditional Rendering Based on Client State

**Problem**: Initial render differs from server render
**Solution**: Use proper loading states or SSR-compatible conditions

## Best Practices

### 1. Consistent className Ordering

- Position classes first: `absolute`, `relative`, `top-*`, `left-*`
- Layout classes: `flex`, `grid`, `w-*`, `h-*`
- Spacing: `p-*`, `m-*`, `gap-*`
- Colors last: `text-*`, `bg-*`, `border-*`

### 2. Use `suppressHydrationWarning` Sparingly

Only use for components that intentionally have different server/client content:

```tsx
<time suppressHydrationWarning>{new Date().toLocaleString()}</time>
```

### 3. Client-Only Components

Use dynamic imports with `ssr: false` for client-only components:

```tsx
const ClientOnlyComponent = dynamic(() => import("./ClientOnly"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### 4. Stable Keys and IDs

Ensure consistent keys across server/client renders:

```tsx
// ❌ May cause hydration issues
{
  items.map((item, index) => <div key={index}>{item}</div>);
}

// ✅ Stable keys
{
  items.map((item) => <div key={item.id}>{item}</div>);
}
```

## Debugging Hydration Issues

### 1. Check Browser Console

Look for hydration mismatch warnings with specific component traces

### 2. Compare Server/Client HTML

Use browser dev tools to compare initial HTML with hydrated HTML

### 3. Use React DevTools Profiler

Enable "Highlight updates when components render" to spot re-rendering

### 4. Temporary suppressHydrationWarning

Add temporarily to isolate the problematic component

## Fixed Issues in This Project

1. **BlogSearch component**: Fixed className ordering for Search icon and input field
2. **TableOfContents usage**: Fixed prop name from `headings` to `content`
3. **Button className ordering**: Consistent positioning and styling class order

## Prevention Checklist

- [ ] ClassName ordering follows semantic groups
- [ ] No client-only logic in initial render
- [ ] No random values or timestamps in JSX
- [ ] Stable keys for lists and maps
- [ ] Conditional rendering is SSR-compatible
- [ ] TypeScript compilation passes without errors
