import { baseUrl } from "../sitemap";
import { getBlogPosts } from "@/app/blog/utils";

export async function GET() {
  const blogs = getBlogPosts();

  const blogsText = blogs
    .map((b) => `• "${b.metadata.title}" - ${b.metadata.summary || "No summary"}`)
    .join("\n");

  const summary = `Davidson Rafael - Portfolio & Blog

ABOUT
Davidson Rafael is a passionate developer specializing in modern web development.

BLOG CONTENT
${blogsText}
`;

  return new Response(summary, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
