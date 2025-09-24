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

function generateAtomEntry(post: ReturnType<typeof getBlogPosts>[0]) {
  const id = `${baseUrl}/blog/${post.slug}`;
  const categories =
    post.metadata.categories
      ?.map((cat) => `    <category term="${escapeXml(cat)}" />`)
      .join("\n") || "";

  const tags =
    post.metadata.tags
      ?.map((tag) => `    <category term="${escapeXml(tag)}" scheme="tag" />`)
      .join("\n") || "";

  return `
  <entry>
    <title type="html">${escapeXml(post.metadata.title)}</title>
    <id>${id}</id>
    <link href="${id}" />
    <updated>${new Date(post.metadata.publishedAt).toISOString()}</updated>
    <published>${new Date(post.metadata.publishedAt).toISOString()}</published>
    <author>
      <name>Davidson Rafael</name>
      <email>hello@davidsonrafael.com</email>
    </author>
    <summary type="html"><![CDATA[${post.metadata.summary || ""}]]></summary>
    <content type="html"><![CDATA[
      ${post.metadata.summary ? `<p>${post.metadata.summary}</p>` : ""}
      <p><a href="${id}">Read the full article</a></p>
    ]]></content>
    ${categories}
    ${tags}
  </entry>`;
}

export async function GET() {
  const allBlogs = getBlogPosts();
  const sortedPosts = allBlogs.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  const entriesXml = sortedPosts
    .slice(0, 20) // Limit to 20 most recent posts
    .map(generateAtomEntry)
    .join("\n");

  const lastUpdated =
    sortedPosts.length > 0 && sortedPosts[0]?.metadata?.publishedAt
      ? new Date(sortedPosts[0].metadata.publishedAt).toISOString()
      : new Date().toISOString();

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Davidson Rafael's Blog</title>
  <subtitle>Tech insights, development tutorials, and thoughts on modern web development</subtitle>
  <link href="${baseUrl}/atom" rel="self" type="application/atom+xml" />
  <link href="${baseUrl}" rel="alternate" type="text/html" />
  <id>${baseUrl}/</id>
  <updated>${lastUpdated}</updated>
  <author>
    <name>Davidson Rafael</name>
    <email>hello@davidsonrafael.com</email>
  </author>
  <generator uri="https://nextjs.org/" version="15.0">Next.js</generator>
  <logo>${baseUrl}/favicon.ico</logo>
  <icon>${baseUrl}/favicon.ico</icon>
  <category term="Technology" />
  <category term="Web Development" />
  <category term="Programming" />
  <category term="Tutorial" />
  ${entriesXml}
</feed>`;

  return new Response(atomFeed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400", // Cache for 1 hour, stale for 1 day
    },
  });
}
