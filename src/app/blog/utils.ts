import fs from "fs";
import path from "path";
import readingTime from "reading-time";

export interface BlogMetadata {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
}

export interface BlogPost {
  metadata: BlogMetadata;
  slug: string;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
}

interface ParsedMDX {
  metadata: BlogMetadata;
  content: string;
}

function parseFrontMatter(fileContent: string): ParsedMDX | null {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match || !match[1]) return null;

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");

  const metadata: Partial<BlogMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    if (!key) return;

    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    metadata[key.trim() as keyof BlogMetadata] = value;
  });

  return { metadata: metadata as BlogMetadata, content };
}

function getMDXFiles(dir: string): string[] {
  try {
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

function getMDXData(dir: string): BlogPost[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    const stats = readingTime(content);

    return {
      metadata,
      slug,
      content,
      readingTime: {
        text: stats.text,
        minutes: Math.ceil(stats.minutes),
        words: stats.words,
      },
    };
  });
}

export function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "src", "app", "blog", "posts");
  return getMDXData(postsDirectory);
}

export function formatDate(date: string, includeRelative = false): string {
  const currentDate = new Date();
  const dateWithTime = date.includes("T") ? date : `${date}T00:00:00`;
  const targetDate = new Date(dateWithTime);

  if (Number.isNaN(targetDate.getTime())) {
    return "Invalid Date";
  }

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return includeRelative ? `${fullDate} (${formattedDate})` : fullDate;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find((post) => post.slug === slug);
}
