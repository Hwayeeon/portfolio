import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { BlogPosts } from "@/components/posts";
import { generateBlogListMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  return generateBlogListMetadata({
    category: resolvedSearchParams.category,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000",
  });
}

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
          <p className="text-muted-foreground text-lg">
            Thoughts on web development, programming, and technology.
          </p>
        </div>
      </header>

      <Suspense fallback={<div className="py-8 text-center">Loading posts...</div>}>
        <BlogPosts />
      </Suspense>
    </div>
  );
}
