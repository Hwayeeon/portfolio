# Week 3 Implementation Plan: Performance & SEO

## 1. Enhance RSS Feed with Full Content

### Current Issue:

- Basic RSS in `src/app/rss/route.ts` only has title and summary
- Missing full content, categories, and proper XML formatting

### Implementation:

```typescript
// Enhanced RSS with full content
export async function GET() {
  const posts = getBlogPosts();
  const projects = getProjects();

  const rssItems = [
    ...posts.map((post) => ({
      title: post.metadata.title,
      link: `${baseUrl}/blog/${post.slug}`,
      description: post.metadata.summary,
      content: post.content, // Full content
      categories: post.metadata.categories,
      pubDate: new Date(post.metadata.publishedAt),
    })),
    ...projects.map((project) => ({
      title: `Project: ${project.metadata.title}`,
      link: `${baseUrl}/projects/${project.slug}`,
      description: project.metadata.description,
      content: project.content,
      categories: [project.metadata.category],
      pubDate: new Date(project.metadata.publishedAt),
    })),
  ];
}
```

## 2. Optimize Bundle Size with Dynamic Imports

### Target Components for Lazy Loading:

- CodeBlock component (heavy with Shiki)
- Table of Contents (only needed in blog posts)
- Project List (not above the fold)
- Theme Toggle (below the fold)

### Implementation:

```typescript
// Lazy load heavy components
const CodeBlock = dynamic(() => import('./code-block'), {
  loading: () => <div className="animate-pulse bg-muted h-32 rounded" />,
  ssr: false
});

const TableOfContents = dynamic(() => import('./table-of-contents'), {
  loading: () => <div className="animate-pulse w-64 h-96 bg-muted rounded" />,
  ssr: false
});
```

## 3. Add More Security Headers

### Current Headers Enhancement:

```typescript
// In next.config.ts - add to existing headers
{
  key: "Permissions-Policy",
  value: "camera=(), microphone=(), geolocation=(), payment=()"
},
{
  key: "Strict-Transport-Security",
  value: "max-age=31536000; includeSubDomains; preload"
},
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.com; style-src 'self' 'unsafe-inline';"
}
```

## 4. Implement Newsletter Signup Form

### Component Design:

```typescript
// src/components/newsletter-form.tsx
const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Integration with email service (ConvertKit, Mailchimp, etc.)
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };
};
```

### API Route:

```typescript
// src/app/api/newsletter/route.ts
export async function POST(request: Request) {
  const { email } = await request.json();

  // Validate email
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    // Add to email service
    await addToNewsletter(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
```

## Timeline:

- **Day 1-2**: Enhanced RSS feed implementation
- **Day 3-4**: Bundle optimization with dynamic imports
- **Day 5-6**: Security headers and CSP implementation
- **Day 7**: Newsletter form and API integration

## Success Metrics:

- RSS feed validates with feed validators
- Bundle size reduces by 20%+ for initial load
- Security headers score 100% on securityheaders.com
- Newsletter form functional with email validation
