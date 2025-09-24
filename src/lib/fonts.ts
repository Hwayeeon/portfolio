/**
 * Font optimization utilities for better performance
 * Helps reduce CLS and improve font loading performance
 */

export const fontConfig = {
  geistSans: {
    variable: "--font-geist-sans",
    subsets: ["latin"] as const,
    display: "swap" as const,
    preload: true,
  },
  geistMono: {
    variable: "--font-geist-mono", 
    subsets: ["latin"] as const,
    display: "swap" as const,
    preload: true,
  }
} as const;

/**
 * Font fallback stacks for reducing CLS
 */
export const fontFallbacks = {
  sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Consolas", "Liberation Mono", "Menlo", "monospace"]
} as const;