import type { NextConfig } from "next";

// Environment-based configuration
const isDev = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
    optimizePackageImports: ["lucide-react", "date-fns"],
    // Enable Turbopack optimizations based on environment
    turbo: {
      rules: {
        // Configure file loading rules for Turbopack
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
        // Optimize CSS processing
        "*.module.css": {
          loaders: ["css-loader"],
          as: "*.css",
        },
      },
      resolveAlias: {
        // Add path aliases for better import resolution
        "@": "./src",
        "@/components": "./src/components",
        "@/lib": "./src/lib", 
        "@/services": "./src/services",
        "@/types": "./src/types",
        "@/app": "./src/app",
      },
      resolveExtensions: [
        ".mdx",
        ".tsx", 
        ".ts",
        ".jsx",
        ".js",
        ".json",
        ".css",
      ],
      loaders: {
        // Optimize MDX loading performance
        ".mdx": ["@mdx-js/loader"],
      },
    },
    // Performance optimizations
    serverComponentsExternalPackages: ["shiki"],
    optimizeServerReact: isProduction,
    forceSwcTransforms: isProduction,
  },

  // Environment-specific configurations
  ...(isDev && {
    // Development-specific settings
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: "bottom-right",
    },
  }),

  ...(isProduction && {
    // Production-specific settings
    compress: true,
    poweredByHeader: false,
  }),

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
};

export default nextConfig;
