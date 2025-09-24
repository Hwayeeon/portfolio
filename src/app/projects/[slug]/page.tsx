import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, Github, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate } from "@/lib/date-utils";
import { getProjectBySlug, getProjects } from "@/lib/project-utils";
import { cn } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const { metadata } = project;

  return {
    title: `${metadata.title} - Projects`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "article",
      publishedTime: metadata.publishedAt,
      images: metadata.thumbnailUrl ? [metadata.thumbnailUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: metadata.thumbnailUrl ? [metadata.thumbnailUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const { metadata, content } = project;

  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    maintained: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  return (
    <article className="mx-auto max-w-4xl">
      {/* Navigation */}
      <div className="mb-8">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>

      {/* Project Header */}
      <header className="mb-12 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {metadata.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              <Sparkles className="h-4 w-4" />
              Featured
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              statusColors[metadata.status]
            )}
          >
            {metadata.status}
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{metadata.title}</h1>
          <p className="text-muted-foreground text-xl leading-relaxed">{metadata.description}</p>
        </div>

        {/* Meta Information */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={metadata.publishedAt}>
              Published {formatDate(metadata.publishedAt)}
            </time>
          </div>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {metadata.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-muted text-muted-foreground rounded-lg px-3 py-1 text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {metadata.liveUrl && (
            <Link
              href={metadata.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Live
            </Link>
          )}
          {metadata.githubUrl && (
            <Link
              href={metadata.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors"
            >
              <Github className="h-4 w-4" />
              View Code
            </Link>
          )}
        </div>
      </header>

      {/* Project Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <CustomMDX source={content} />
      </div>

      {/* Navigation Footer */}
      <footer className="mt-16 border-t pt-8">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all projects
        </Link>
      </footer>
    </article>
  );
}
