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

function generateRssItem(post: ReturnType<typeof getBlogPosts>[0]) {
  const guid = `${baseUrl}/blog/${post.slug}`;
  const categories =
    post.metadata.categories
      ?.map((cat) => `<category>${escapeXml(cat)}</category>`)
      .join("\n          ") || "";

  const tags =
    post.metadata.tags
      ?.map((tag) => `<category domain="tag">${escapeXml(tag)}</category>`)
      .join("\n          ") || "";

  return `
        <item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${guid}</link>
          <description><![CDATA[${post.metadata.summary || ""}]]></description>
          <content:encoded><![CDATA[
            ${post.metadata.summary ? `<p>${post.metadata.summary}</p>` : ""}
            <p><a href="${guid}">Read the full article</a></p>
          ]]></content:encoded>
          <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
          <guid isPermaLink="true">${guid}</guid>
          <author>hello@davidsonrafael.com (Davidson Rafael)</author>
          ${categories}
          ${tags}
          <source url="${baseUrl}/rss">Davidson Rafael's Blog</source>
        </item>`;
}

export async function GET() {
  const allBlogs = getBlogPosts();
  const sortedPosts = allBlogs.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  const itemsXml = sortedPosts
    .slice(0, 20) // Limit to 20 most recent posts
    .map(generateRssItem)
    .join("\n");

  const lastBuildDate = new Date().toUTCString();
  const lastPubDate =
    sortedPosts.length > 0 && sortedPosts[0]?.metadata?.publishedAt
      ? new Date(sortedPosts[0].metadata.publishedAt).toUTCString()
      : lastBuildDate;

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Davidson Rafael's Blog</title>
    <link>${baseUrl}</link>
    <description>Tech insights, development tutorials, and thoughts on modern web development from Davidson Rafael</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastPubDate}</pubDate>
    <ttl>1440</ttl>
    <managingEditor>hello@davidsonrafael.com (Davidson Rafael)</managingEditor>
    <webMaster>hello@davidsonrafael.com (Davidson Rafael)</webMaster>
    <generator>Next.js RSS Generator</generator>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>Davidson Rafael's Blog</title>
      <link>${baseUrl}</link>
      <width>32</width>
      <height>32</height>
    </image>
    <category>Technology</category>
    <category>Web Development</category>
    <category>Programming</category>
    <category>Tutorial</category>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400", // Cache for 1 hour, stale for 1 day
    },
  });
}
