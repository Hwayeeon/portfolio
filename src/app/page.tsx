import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { PostCardSkeleton } from "@/components/loading";

// Lazy load the LatestPosts component since it's below the fold
const LatestPosts = dynamic(
  () => import("@/components/latest-posts").then((mod) => ({ default: mod.LatestPosts })),
  {
    ssr: true, // Still render on server for SEO
    loading: () => <PostCardSkeleton count={3} />,
  }
);

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Hi, I&apos;m Davidson Rafael
        </h1>
        <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed">
          A passionate developer who finds efficiency in Vim&apos;s keystroke commands, advocates
          for tabs&apos; flexibility in personal viewing preferences, and believes in the power of
          static typing for cleaner code. I prefer dark mode for those long coding sessions that
          reduce eye strain.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/blog"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            Read my blog
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#latest-posts"
            className="border-border hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors"
          >
            View latest posts
          </Link>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section id="latest-posts" className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Latest Posts</h2>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            View all posts →
          </Link>
        </div>
        <LatestPosts limit={3} />
      </section>
    </div>
  );
}
