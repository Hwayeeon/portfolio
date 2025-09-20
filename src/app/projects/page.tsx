import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects",
  description: "A showcase of my latest projects and open-source contributions.",
  openGraph: {
    title: "Projects - Davidson Rafael",
    description: "A showcase of my latest projects and open-source contributions.",
  },
};

interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "Portfolio & Blog",
    description:
      "A modern, fast, and SEO-optimized portfolio built with Next.js 15, featuring MDX blog posts, dark mode, and excellent performance scores.",
    tech: ["Next.js 15", "React 19", "TypeScript", "TailwindCSS", "MDX", "Shiki"],
    github: "https://github.com/Hwayeeon/portfolio",
    demo: "https://www.davidsonrafael.me/",
    featured: true,
  },
  {
    title: "Task Management App",
    description:
      "A full-stack task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    tech: ["React", "Node.js", "PostgreSQL", "Socket.io", "Prisma", "TailwindCSS"],
    github: "https://github.com/Hwayeeon/",
    demo: "https://www.davidsonrafael.me/",
    featured: true,
  },
  {
    title: "Weather Dashboard",
    description:
      "A beautiful weather application with location-based forecasts, interactive charts, and responsive design.",
    tech: ["Vue.js", "Chart.js", "OpenWeather API", "SCSS"],
    github: "https://github.com/Hwayeeon/",
    demo: "https://www.davidsonrafael.me/",
  },
  {
    title: "E-commerce Platform",
    description:
      "A modern e-commerce solution with payment integration, admin dashboard, and inventory management.",
    tech: ["Next.js", "Stripe", "Supabase", "TailwindCSS", "Zustand"],
    github: "https://github.com/Hwayeeon/",
    featured: true,
  },
];

function TechBadge({ tech }: { tech: string }) {
  return (
    <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
      {tech}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={`group border-border bg-card relative overflow-hidden rounded-lg border p-6 transition-all hover:shadow-lg ${
        project.featured ? "ring-primary/20 ring-2" : ""
      }`}
    >
      {project.featured && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
            Featured
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="group-hover:text-primary text-xl font-semibold transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Github className="h-4 w-4" />
              Code
            </Link>
          )}
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Projects</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          A collection of projects I&apos;ve worked on, from web applications to open-source
          contributions.
        </p>
      </header>

      {featuredProjects.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Featured Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Other Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4 py-12 text-center">
        <h2 className="text-xl font-semibold">Want to see more?</h2>
        <p className="text-muted-foreground">
          Check out my GitHub for more projects and contributions.
        </p>
        <Link
          href="https://github.com/your-username"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
        >
          <Github className="h-4 w-4" />
          Visit GitHub
        </Link>
      </section>
    </div>
  );
}
