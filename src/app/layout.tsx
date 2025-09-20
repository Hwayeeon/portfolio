import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Davidson Rafael - Portfolio",
    template: "%s | Davidson Rafael",
  },
  description:
    "A passionate developer showcasing projects, thoughts, and expertise in modern web development.",
  keywords: [
    "portfolio",
    "web development",
    "Next.js",
    "React",
    "TypeScript",
    "Vim",
    "programming",
  ],
  authors: [{ name: "Davidson Rafael" }],
  creator: "Davidson Rafael",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Davidson Rafael - Portfolio",
    description:
      "A passionate developer showcasing projects, thoughts, and expertise in modern web development.",
    siteName: "Davidson Rafael Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Davidson Rafael - Portfolio",
    description:
      "A passionate developer showcasing projects, thoughts, and expertise in modern web development.",
  },
  metadataBase: new URL("https://portfolio-blog-starter.vercel.app"),
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        <Header />
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
          <main className="flex-1">{children}</main>
          <footer className="border-border text-muted-foreground mt-16 border-t py-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Davidson Rafael. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
