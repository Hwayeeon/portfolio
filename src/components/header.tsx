import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="hover:text-accent-foreground text-lg font-semibold transition-colors"
          >
            Davidson Rafael
          </Link>
          <div className="hidden items-center space-x-4 text-sm sm:flex">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </Link>
          </div>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
