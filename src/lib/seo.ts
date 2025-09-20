import { Metadata } from "next";
import { resolveThumbnail, type EnhancedBlogPost } from "@/lib/blog-utils";

interface SEOProps {
  post: EnhancedBlogPost;
  baseUrl?: string;
}

export function generatePostMetadata({
  post,
  baseUrl = "https://www.davidsonrafael.me/",
}: SEOProps): Metadata {
  const thumbnail = resolveThumbnail(post);
  const url = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = thumbnail.isPlaceholder
    ? `${baseUrl}/api/og?title=${encodeURIComponent(post.metadata.title)}`
    : thumbnail.src;

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    authors: [{ name: "Davidson Rafael" }],
    keywords: post.metadata.tags || [],
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      type: "article",
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: thumbnail.alt,
        },
      ],
      publishedTime: post.metadata.publishedAt,
      authors: ["Your Name"],
      tags: post.metadata.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: post.metadata.summary,
      images: [imageUrl],
      creator: "@yourusername",
      site: "@yourusername",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface BlogListMetadataProps {
  category?: string | undefined;
  baseUrl?: string;
}

export function generateBlogListMetadata({
  category,
  baseUrl = "https://www.davidsonrafael.me/",
}: BlogListMetadataProps = {}): Metadata {
  const title = category && category !== "all" ? `${category} Posts - Blog` : "Blog - All Posts";

  const description =
    category && category !== "all"
      ? `Read articles about ${category}. Exploring web development, programming, and technology.`
      : "Read my latest articles on web development, programming, and technology.";

  const url =
    category && category !== "all" ? `${baseUrl}/blog?category=${category}` : `${baseUrl}/blog`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(title)}`],
      creator: "@davidsonrafael_",
      site: "@davidsonrafael_",
    },
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": [
          {
            url: `${baseUrl}/rss`,
            title: "RSS Feed",
          },
        ],
      },
    },
  };
}
