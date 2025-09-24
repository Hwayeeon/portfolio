/**
 * Development configuration optimized for Turbopack
 * Performance monitoring and build optimization settings
 */

export const devConfig = {
  // Turbopack-specific development settings
  turbopack: {
    // Enable experimental features for better performance
    experimentalFeatures: {
      hotReload: true,
      fastRefresh: true,
      incrementalCompilation: true,
    },

    // Cache configuration for faster rebuilds
    cache: {
      type: "filesystem" as const,
      cacheDirectory: ".next/turbo-cache",
      buildDependencies: {
        config: ["next.config.ts", "tsconfig.json", "package.json"],
      },
    },

    // Asset optimization for development
    assets: {
      minimizeImages: false, // Disable in dev for speed
      optimizeFonts: true,
      inlineCriticalCSS: false, // Keep separate for debugging
    },
  },

  // Performance monitoring thresholds
  performance: {
    maxInitialRequests: 30,
    maxAsyncRequests: 30,
    minChunkSize: 20000,
    maxChunkSize: 244000,
  },

  // Development server optimization
  devServer: {
    compress: true,
    hot: true,
    liveReload: false, // Use fast refresh instead
    watchOptions: {
      ignored: ["node_modules", ".next", ".git"],
      aggregateTimeout: 300,
      poll: false,
    },
  },
} as const;

export const buildConfig = {
  // Production build optimization
  optimization: {
    minimize: true,
    sideEffects: false,
    usedExports: true,
    providedExports: true,
  },

  // Bundle analysis configuration
  analyze: {
    enabled: process.env.ANALYZE === "true",
    openAnalyzer: false,
    generateStatsFile: true,
  },
} as const;

export default { devConfig, buildConfig };
