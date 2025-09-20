import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPosts } from "@/components/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest articles on web development, programming, and technology. Exploring topics from Vim workflows to modern web development practices.",
  openGraph: {
    title: "Blog - Davidson Rafael",
    description: "Read my latest articles on web development, programming, and technology.",
  },
};

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Thoughts on web development, programming, and technology.
          </p>
        </div>
      </header>
      <BlogPosts />
    </div>
  );
}
