import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectList } from "@/components/project-list";
import { getProjects } from "@/lib/project-utils";

export const metadata: Metadata = {
  title: "Projects - Davidson Rafael",
  description: "A showcase of my development projects, applications, and technical experiments.",
  openGraph: {
    title: "Projects - Davidson Rafael",
    description: "A showcase of my development projects, applications, and technical experiments.",
    type: "website",
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

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
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Projects</h1>
          <p className="text-muted-foreground text-lg">
            A collection of projects I&apos;ve built, ranging from web applications to developer
            tools and experiments.
          </p>
        </div>
      </header>

      <ProjectList projects={projects} />
    </div>
  );
}
