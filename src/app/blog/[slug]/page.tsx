import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts, getBlogPostBySlug, type BlogPost } from "../utils";
import { baseUrl } from "@/app/sitemap";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts: BlogPost[] = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return undefined;

  const { title, publishedAt: publishedTime, summary: description, image } = post.metadata;

  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.publishedAt,
    description: post.metadata.summary,
    wordCount: post.readingTime.words,
    image: post.metadata.image
      ? `${baseUrl}${post.metadata.image}`
      : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${baseUrl}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Davidson Rafael",
    },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <nav className="mb-8">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
      </nav>

      <header className="mb-12 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {post.metadata.title}
        </h1>
        <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm">
          <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{post.readingTime.text}</span>
          </div>
          <span>{post.readingTime.words} words</span>
        </div>
      </header>

      <article className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
        <CustomMDX source={post.content} />
      </article>
    </div>
  );
}
