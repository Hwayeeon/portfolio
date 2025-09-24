import Image from "next/image";
import Link from "next/link";
import { Calendar, ExternalLink, Github, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { createBlurDataURL } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  className?: string;
}

export function ProjectCard({ project, priority = false, className }: ProjectCardProps) {
  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    maintained: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  const categoryIcons = {
    web: "🌐",
    mobile: "📱",
    cli: "⚡",
    library: "📚",
    experiment: "🧪",
  };

  return (
    <article
      className={cn(
        "group border-border bg-card overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5",
        className
      )}
    >
      {/* Thumbnail Section */}
      <div className="bg-muted relative aspect-[16/9] overflow-hidden">
        {project.metadata.thumbnailUrl ? (
          <Image
            src={project.metadata.thumbnailUrl}
            alt={`${project.metadata.title} preview`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            placeholder="blur"
            blurDataURL={createBlurDataURL()}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            {categoryIcons[project.metadata.category]}
          </div>
        )}

        {/* Featured Badge */}
        {project.metadata.featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 backdrop-blur-sm dark:bg-yellow-900 dark:text-yellow-300">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              statusColors[project.metadata.status]
            )}
          >
            {project.metadata.status}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {/* Title */}
          <h2 className="text-foreground group-hover:text-primary line-clamp-2 text-lg leading-tight font-semibold transition-colors sm:text-xl">
            {project.metadata.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed sm:text-base">
            {project.metadata.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1">
            {project.metadata.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs"
              >
                {tech}
              </span>
            ))}
            {project.metadata.technologies.length > 4 && (
              <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
                +{project.metadata.technologies.length - 4} more
              </span>
            )}
          </div>

          {/* Meta Information */}
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={project.metadata.publishedAt}>
                {formatDate(project.metadata.publishedAt)}
              </time>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {project.metadata.liveUrl && (
              <Link
                href={project.metadata.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                View Live
              </Link>
            )}
            {project.metadata.githubUrl && (
              <Link
                href={project.metadata.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <Github className="h-3 w-3" />
                Code
              </Link>
            )}
            <Link
              href={`/projects/${project.slug}`}
              className="border-border hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      {/* Thumbnail Skeleton */}
      <div className="bg-muted aspect-[16/9] animate-pulse" />

      {/* Content Skeleton */}
      <div className="space-y-3 p-4 sm:p-6">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="bg-muted h-5 animate-pulse rounded" />
          <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="bg-muted h-4 animate-pulse rounded" />
          <div className="bg-muted h-4 animate-pulse rounded" />
          <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        </div>

        {/* Technologies Skeleton */}
        <div className="flex gap-2">
          <div className="bg-muted h-6 w-16 animate-pulse rounded" />
          <div className="bg-muted h-6 w-20 animate-pulse rounded" />
          <div className="bg-muted h-6 w-12 animate-pulse rounded" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-2">
          <div className="bg-muted h-8 w-20 animate-pulse rounded" />
          <div className="bg-muted h-8 w-16 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
