export interface ProjectMetadata {
  title: string;
  description: string;
  publishedAt: string;
  status: "completed" | "in-progress" | "maintained" | "archived";
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  featured?: boolean;
  category: "web" | "mobile" | "cli" | "library" | "experiment";
}

export interface Project {
  slug: string;
  metadata: ProjectMetadata;
  content: string;
}
