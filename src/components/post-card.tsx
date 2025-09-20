import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { resolveThumbnail, createBlurDataURL, type EnhancedBlogPost } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: EnhancedBlogPost;
  priority?: boolean;
  layout?: "default" | "square";
  className?: string;
}

export function PostCard({ post, priority = false, layout = "default", className }: PostCardProps) {
  const thumbnail = resolveThumbnail(post);
  const isSquare = layout === "square";

  return (
    <article
      className={cn(
        "group border-border bg-card overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5",
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Thumbnail Section */}
        <div
          className={cn(
            "bg-muted relative overflow-hidden",
            isSquare ? "aspect-square" : "aspect-[16/9]"
          )}
        >
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              thumbnail.isPlaceholder && "object-contain"
            )}
            priority={priority}
            placeholder="blur"
            blurDataURL={createBlurDataURL()}
            sizes={
              isSquare
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />

          {/* Categories Overlay */}
          {post.metadata.categories && post.metadata.categories.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {post.metadata.categories.slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {category}
                </span>
              ))}
              {post.metadata.categories.length > 2 && (
                <span className="rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  +{post.metadata.categories.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6">
          <div className="space-y-3">
            {/* Title */}
            <h2 className="text-foreground group-hover:text-primary line-clamp-2 text-lg leading-tight font-semibold transition-colors sm:text-xl">
              {post.metadata.title}
            </h2>

            {/* Meta Information */}
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={post.metadata.publishedAt}>
                  {formatDate(post.metadata.publishedAt)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.readingTime.text}</span>
              </div>
            </div>

            {/* Summary */}
            {post.metadata.summary && (
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed sm:text-base">
                {post.metadata.summary}
              </p>
            )}

            {/* Tags */}
            {post.metadata.tags && post.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {post.metadata.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {post.metadata.tags.length > 3 && (
                  <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
                    +{post.metadata.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PostCardSkeleton({ layout = "default" }: { layout?: "default" | "square" }) {
  const isSquare = layout === "square";

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      {/* Thumbnail Skeleton */}
      <div className={cn("bg-muted animate-pulse", isSquare ? "aspect-square" : "aspect-[16/9]")} />

      {/* Content Skeleton */}
      <div className="space-y-3 p-4 sm:p-6">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="bg-muted h-5 animate-pulse rounded" />
          <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
        </div>

        {/* Meta Skeleton */}
        <div className="flex gap-4">
          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
        </div>

        {/* Summary Skeleton */}
        <div className="space-y-2">
          <div className="bg-muted h-4 animate-pulse rounded" />
          <div className="bg-muted h-4 animate-pulse rounded" />
          <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
