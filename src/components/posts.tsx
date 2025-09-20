import Link from "next/link";
import { Clock } from "lucide-react";
import { formatDate, getBlogPosts } from "@/app/blog/utils";

export function BlogPosts() {
  const allBlogs = getBlogPosts();

  if (allBlogs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allBlogs
        .sort((a, b) => {
          const dateA = new Date(a.metadata.publishedAt);
          const dateB = new Date(b.metadata.publishedAt);
          return dateB.getTime() - dateA.getTime();
        })
        .map((post) => (
          <article key={post.slug} className="group">
            <Link
              href={`/blog/${post.slug}`}
              className="border-border hover:border-accent-foreground hover:bg-accent/50 block rounded-lg border p-6 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <h2 className="text-foreground group-hover:text-accent-foreground text-xl font-semibold transition-colors">
                    {post.metadata.title}
                  </h2>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <time dateTime={post.metadata.publishedAt}>
                      {formatDate(post.metadata.publishedAt)}
                    </time>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readingTime.text}</span>
                    </div>
                  </div>
                </div>
                {post.metadata.summary && (
                  <p className="text-muted-foreground leading-relaxed">{post.metadata.summary}</p>
                )}
              </div>
            </Link>
          </article>
        ))}
    </div>
  );
}
