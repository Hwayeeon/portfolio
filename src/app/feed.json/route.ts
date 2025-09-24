import { baseUrl } from "../sitemap";
import { getBlogPosts } from "@/app/blog/utils";

export async function GET() {
  const allBlogs = getBlogPosts();
  const sortedPosts = allBlogs.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  const items = sortedPosts
    .slice(0, 20) // Limit to 20 most recent posts
    .map((post) => ({
      id: `${baseUrl}/blog/${post.slug}`,
      url: `${baseUrl}/blog/${post.slug}`,
      title: post.metadata.title,
      content_html: post.metadata.summary 
        ? `<p>${post.metadata.summary}</p><p><a href="${baseUrl}/blog/${post.slug}">Read the full article</a></p>`
        : `<p><a href="${baseUrl}/blog/${post.slug}">Read the full article</a></p>`,
      summary: post.metadata.summary || '',
      date_published: new Date(post.metadata.publishedAt).toISOString(),
      tags: [
        ...(post.metadata.categories || []),
        ...(post.metadata.tags || []),
      ],
      authors: [
        {
          name: 'Davidson Rafael',
          url: baseUrl,
        },
      ],
    }));

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: "Davidson Rafael's Blog",
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/feed.json`,
    description: 'Tech insights, development tutorials, and thoughts on modern web development from Davidson Rafael',
    icon: `${baseUrl}/favicon.ico`,
    favicon: `${baseUrl}/favicon.ico`,
    language: 'id-ID',
    authors: [
      {
        name: 'Davidson Rafael',
        url: baseUrl,
      },
    ],
    items,
  };

  return new Response(JSON.stringify(jsonFeed, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400", // Cache for 1 hour, stale for 1 day
    },
  });
}