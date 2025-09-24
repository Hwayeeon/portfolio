import { baseUrl } from "../sitemap";
import { getBlogPosts } from "@/app/blog/utils";

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const allBlogs = getBlogPosts();

  const itemsXml = allBlogs
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
    .map(
      (post) => `
        <item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <description>${
            post.metadata.summary ? escapeXml(post.metadata.summary) : ""
          }</description>
          <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Davidson Rafael</title>
      <link>${baseUrl}</link>
      <description>Davidson Rafael RSS feed</description>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <language>en-US</language>
      ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
