import type { BlogPost } from "@/app/blog/utils";

export interface EnhancedBlogPost extends BlogPost {
  metadata: BlogPost["metadata"] & {
    categories?: string[];
    tags?: string[];
    thumbnailUrl?: string | undefined;
    images?: string[];
  };
}

/**
 * Resolves the thumbnail for a blog post following priority:
 * 1. Explicit thumbnailUrl in metadata
 * 2. First image from content
 * 3. Generated SVG placeholder
 */
export function resolveThumbnail(post: EnhancedBlogPost): {
  src: string;
  alt: string;
  isPlaceholder: boolean;
} {
  // Check explicit thumbnail
  if (post.metadata.thumbnailUrl) {
    return {
      src: post.metadata.thumbnailUrl,
      alt: `${post.metadata.title} thumbnail`,
      isPlaceholder: false,
    };
  }

  // Check first image from metadata
  if (post.metadata.images && post.metadata.images.length > 0 && post.metadata.images[0]) {
    return {
      src: post.metadata.images[0],
      alt: `${post.metadata.title} preview`,
      isPlaceholder: false,
    };
  }

  // Extract first image from content
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const match = post.content.match(imageRegex);
  if (match && match[2]) {
    return {
      src: match[2],
      alt: match[1] || `${post.metadata.title} content image`,
      isPlaceholder: false,
    };
  }

  // Generate SVG placeholder
  return {
    src: generatePlaceholderSVG(post.metadata.title),
    alt: `${post.metadata.title} placeholder`,
    isPlaceholder: true,
  };
}

/**
 * Generates an SVG placeholder with the first letter of the title
 */
export function generatePlaceholderSVG(title: string): string {
  const firstLetter = title.charAt(0).toUpperCase();
  const colors: [string, string][] = [
    ["#3B82F6", "#1E40AF"], // blue
    ["#10B981", "#047857"], // emerald
    ["#F59E0B", "#D97706"], // amber
    ["#EF4444", "#DC2626"], // red
    ["#8B5CF6", "#7C3AED"], // violet
    ["#06B6D4", "#0891B2"], // cyan
  ];

  // Use title length to select color consistently
  const colorIndex = title.length % colors.length;
  const selectedColor = colors[colorIndex]!; // Non-null assertion since colorIndex is always valid
  const lightColor = selectedColor[0];
  const darkColor = selectedColor[1];

  const svg = `
    <svg width="320" height="180" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${lightColor}" />
          <stop offset="100%" style="stop-color:${darkColor}" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#gradient)" />
      <text x="160" y="105" font-family="system-ui, -apple-system, sans-serif" 
            font-size="48" font-weight="bold" text-anchor="middle" 
            fill="white" opacity="0.9">${firstLetter}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Generates alt text for images based on context
 */
export function getImageAlt(
  post: EnhancedBlogPost,
  imageIndex: number = 0,
  customAlt?: string
): string {
  if (customAlt && customAlt.trim()) {
    return customAlt.trim();
  }

  const imageNumber = imageIndex + 1;
  return `Illustration ${imageNumber} for ${post.metadata.title}`;
}

/**
 * Extracts all categories from blog posts
 */
export function getAllCategories(posts: EnhancedBlogPost[]): string[] {
  const categories = new Set<string>();

  posts.forEach((post) => {
    if (post.metadata.categories) {
      post.metadata.categories.forEach((cat) => categories.add(cat));
    }
  });

  return Array.from(categories).sort();
}

/**
 * Filters posts by category
 */
export function filterPostsByCategory(
  posts: EnhancedBlogPost[],
  category?: string
): EnhancedBlogPost[] {
  if (!category || category === "all") {
    return posts;
  }

  return posts.filter((post) => post.metadata.categories?.includes(category));
}

/**
 * Creates a blurred placeholder for smooth loading
 */
export function createBlurDataURL(width: number = 320, height: number = 180): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
