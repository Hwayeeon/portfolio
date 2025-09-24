import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-slot"]
  },

  // Bundle optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable compression
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enhanced image optimization
    loader: "default",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      // Add specific domains for better security
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // Performance optimization headers
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Static assets caching
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Font preloading
      {
        source: "/(.*)",
        headers: [
          {
            key: "Link",
            value:
              "</fonts/geist-sans.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/posts/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    }
  }
};

export default nextConfig;
