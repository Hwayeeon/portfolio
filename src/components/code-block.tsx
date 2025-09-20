"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ children, language = "text", filename }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    async function highlightCode() {
      try {
        const html = await codeToHtml(children.trim(), {
          lang: language,
          theme: "github-dark",
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(
          `<pre class="bg-[#0d1117] p-4 rounded overflow-x-auto"><code class="font-mono text-sm">${children}</code></pre>`
        );
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
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="group relative my-6">
      {filename && (
        <div className="bg-muted border-border flex items-center justify-between rounded-t-lg border px-4 py-2">
          <span className="text-muted-foreground text-sm font-medium">{filename}</span>
          <span className="text-muted-foreground text-xs uppercase">{language}</span>
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
          className={`${filename ? "rounded-t-none" : "rounded-lg"} border-border overflow-hidden border [&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!border-none`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}
