"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import React from "react";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  title?: string;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

export function CodeBlock({ children, language = "text", filename, title }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function highlightCode() {
      try {
        setIsLoading(true);

        // Normalize language name
        const normalizedLang = language.toLowerCase().trim();
        const langMap: { [key: string]: string } = {
          js: "javascript",
          ts: "typescript",
          py: "python",
          sh: "bash",
          yml: "yaml",
        };

        const resolvedLang = langMap[normalizedLang] || normalizedLang;

        // Dynamically import shiki for better code splitting
        const { codeToHtml } = await import("shiki");

        const html = await codeToHtml(children, {
          lang: resolvedLang,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
          cssVariablePrefix: "--shiki-",
        });

        setHighlightedCode(html);
      } catch (error) {
        // Log error in development, fail silently in production
        if (process.env.NODE_ENV === "development") {
          console.error("Error highlighting code:", error);
        }
        // Fallback to escaped HTML
        setHighlightedCode(`<pre><code>${escapeHtml(children)}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    }

    highlightCode();
  }, [children, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to copy:", error);
      }
    }
  };

  const displayTitle = title || filename;
  const displayLanguage = language && language !== "text" ? language.toLowerCase() : "";

  // Better language display names
  const languageDisplayNames: { [key: string]: string } = {
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

  const prettyLanguage = displayLanguage
    ? languageDisplayNames[displayLanguage] || displayLanguage.toUpperCase()
    : "";

  if (isLoading) {
    return (
      <div className="group relative my-6">
        {displayTitle && (
          <div className="bg-muted border-border flex items-center justify-between rounded-t-lg border px-4 py-2">
            <span className="text-muted-foreground text-sm font-medium">{displayTitle}</span>
            {prettyLanguage && (
              <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
                {prettyLanguage}
              </span>
            )}
          </div>
        )}
        <div
          className={`bg-[#0d1117] ${displayTitle ? "rounded-t-none" : "rounded-lg"} border-border border p-4`}
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
      {displayTitle && (
        <div className="bg-muted border-border flex items-center justify-between rounded-t-lg border px-4 py-2">
          <span className="text-muted-foreground text-sm font-medium">{displayTitle}</span>
          {prettyLanguage && (
            <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
              {prettyLanguage}
            </span>
          )}
        </div>
      )}

      {/* Show language badge if no title but there's a language */}
      {!displayTitle && prettyLanguage && (
        <div className="bg-muted border-border absolute top-3 left-3 z-10 rounded border px-2 py-1">
          <span className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
            {prettyLanguage}
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
          className={`${displayTitle ? "rounded-t-none" : "rounded-lg"} border-border overflow-hidden border [&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!border-none [&>pre]:!bg-[#0d1117]`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}
