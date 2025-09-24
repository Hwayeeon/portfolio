import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-4">
        <h1 className="text-muted-foreground text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/blog"
          className="border-border hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Visit Blog
        </Link>
      </div>
    </div>
  );
}
