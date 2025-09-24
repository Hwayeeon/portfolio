import fs from "fs";
import path from "path";
import type { Project, ProjectMetadata } from "@/types/project";

interface ParsedMDX {
  metadata: ProjectMetadata;
  content: string;
}

function parseFrontMatter(fileContent: string): ParsedMDX | null {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match || !match[1]) return null;

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");

  const metadata: Partial<ProjectMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    if (!key) return;

    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");

    const trimmedKey = key.trim() as keyof ProjectMetadata;

    // Handle arrays for technologies
    if (trimmedKey === "technologies") {
      if (value.startsWith("[") && value.endsWith("]")) {
        const arrayValue = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/^['"](.*)['"]$/, "$1"));
        (metadata as Record<string, unknown>)[trimmedKey] = arrayValue;
      } else {
        (metadata as Record<string, unknown>)[trimmedKey] = [value];
      }
    } else if (trimmedKey === "featured") {
      (metadata as Record<string, unknown>)[trimmedKey] = value === "true";
    } else {
      (metadata as Record<string, unknown>)[trimmedKey] = value;
    }
  });

  return { metadata: metadata as ProjectMetadata, content };
}

function getMDXFiles(dir: string): string[] {
  try {
    if (!fs.existsSync(dir)) {
      return [];
    }
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

function readMDXFile(filePath: string): ParsedMDX {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const parsed = parseFrontMatter(rawContent);
    if (!parsed) {
      throw new Error(`Invalid frontmatter in file: ${filePath}`);
    }
    return parsed;
  } catch (error) {
    console.error(`Error reading MDX file ${filePath}:`, error);
    throw error;
  }
}

export function getProjects(): Project[] {
  const projectsDirectory = path.join(process.cwd(), "src", "app", "projects", "projects");

  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const mdxFiles = getMDXFiles(projectsDirectory);

  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(projectsDirectory, file));
    const slug = path.basename(file, path.extname(file));

    return {
      slug,
      metadata,
      content,
    };
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getProjects();
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.metadata.featured);
}

export function getProjectsByCategory(category: ProjectMetadata["category"]): Project[] {
  return getProjects().filter((project) => project.metadata.category === category);
}
