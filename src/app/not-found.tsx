import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Visit Blog
        </Link>
      </div>
    </div>
  );
}