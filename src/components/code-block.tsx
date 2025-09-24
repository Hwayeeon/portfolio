"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  title?: string;
}

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
};

// Language mapping for better performance (avoid repeated computations)
const LANG_MAP: { [key: string]: string } = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  yml: "yaml",
};

const LANG_DISPLAY_NAMES: { [key: string]: string } = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  html: "HTML",
  css: "CSS",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  json: "JSON",
  yaml: "YAML",
  markdown: "Markdown",
  tsx: "TSX",
  jsx: "JSX",
};

function CodeBlockComponent({ children, language = "text", filename, title }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Memoize resolved language to avoid recomputation
  const resolvedLang = useMemo(() => {
    const normalizedLang = language.toLowerCase().trim();
    return LANG_MAP[normalizedLang] || normalizedLang;
  }, [language]);

  // Memoize display information
  const displayInfo = useMemo(
    () => ({
      title: title || filename,
      language: language && language !== "text" ? language.toLowerCase() : "",
      displayName: LANG_DISPLAY_NAMES[resolvedLang] || resolvedLang.toUpperCase(),
    }),
    [title, filename, language, resolvedLang]
  );

  // Optimized copy function
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [children]);

  useEffect(() => {
    let mounted = true;

    async function highlightCode() {
      if (!mounted) return;

      try {
        setIsLoading(true);

        // Dynamically import shiki for better code splitting
        const { codeToHtml } = await import("shiki");

        if (!mounted) return;

        const html = await codeToHtml(children, {
          lang: resolvedLang,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
          cssVariablePrefix: "--shiki-",
        });

        if (mounted) {
          setHighlightedCode(html);
        }
      } catch (error) {
        console.error("Error highlighting code:", error);
        if (mounted) {
          // Fallback to escaped HTML
          setHighlightedCode(`<pre><code>${escapeHtml(children)}</code></pre>`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    highlightCode();

    return () => {
      mounted = false;
    };
  }, [children, resolvedLang]);

  if (isLoading) {
    return (
      <div className="group relative my-6">
        {displayInfo.title && (
          <div className="bg-muted border-border flex items-center justify-between rounded-t-lg border px-4 py-2">
            <span className="text-muted-foreground text-sm font-medium">{displayInfo.title}</span>
            {displayInfo.displayName && (
              <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
                {displayInfo.displayName}
              </span>
            )}
          </div>
        )}
        <div
          className={`bg-[#0d1117] ${displayInfo.title ? "rounded-t-none" : "rounded-lg"} border-border border p-4`}
        >
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-600"></div>
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-600"></div>
            <div className="h-4 w-2/3 rounded bg-gray-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative my-6">
      {displayInfo.title && (
        <div className="bg-muted border-border flex items-center justify-between rounded-t-lg border px-4 py-2">
          <span className="text-muted-foreground text-sm font-medium">{displayInfo.title}</span>
          {displayInfo.displayName && (
            <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
              {displayInfo.displayName}
            </span>
          )}
        </div>
      )}

      {/* Show language badge if no title but there's a language */}
      {!displayInfo.title && displayInfo.displayName && (
        <div className="bg-muted border-border absolute top-3 left-3 z-10 rounded border px-2 py-1">
          <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
            {displayInfo.displayName}
          </span>
        </div>
      )}

      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="bg-background/80 border-border hover:bg-accent absolute top-3 right-3 z-10 rounded-md border p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-label="Copy code to clipboard"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="text-muted-foreground h-4 w-4" />
          )}
        </button>

        <div
          className={`${displayInfo.title ? "rounded-t-none" : "rounded-lg"} border-border overflow-hidden border [&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!border-none [&>pre]:!bg-[#0d1117]`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}

// Export the memoized component for better performance
export const CodeBlock = memo(CodeBlockComponent);
