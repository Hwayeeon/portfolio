// Global type definitions for the portfolio project

declare module "*.mdx" {
  const MDXComponent: (props: Record<string, unknown>) => JSX.Element;
  export default MDXComponent;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "reading-time" {
  interface ReadTimeResults {
    text: string;
    time: number;
    words: number;
    minutes: number;
  }

  function readingTime(text: string, options?: { wordsPerMinute?: number }): ReadTimeResults;
  export = readingTime;
}

// Environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL?: string;
      NEXT_PUBLIC_GA_ID?: string;
      NEXT_PUBLIC_POSTHOG_KEY?: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }

  // Extend window object
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: Record<string, unknown>;
  }
}

export {};
