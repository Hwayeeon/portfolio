import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LatestPosts } from "@/components/latest-posts";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Hi, I&apos;m Davidson Rafael
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          A passionate developer who finds efficiency in Vim&apos;s keystroke commands, 
          advocates for tabs&apos; flexibility in personal viewing preferences, and 
          believes in the power of static typing for cleaner code. I prefer dark 
          mode for those long coding sessions that reduce eye strain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Read my blog
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="#latest-posts" 
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View latest posts
          </Link>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section id="latest-posts" className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Latest Posts
          </h2>
          <Link 
            href="/blog" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all posts →
          </Link>
        </div>
        <LatestPosts limit={3} />
      </section>
    </div>
  );
}
