"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  className?: string;
  height?: string;
  backgroundColor?: string;
}

export function ReadingProgress({
  className,
  height = "h-1",
  backgroundColor = "bg-primary",
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position
      const scrollTop = window.scrollY;

      // Get total scrollable height
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Calculate progress percentage
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      // Ensure progress is between 0 and 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    // Set initial progress
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn("fixed top-0 left-0 z-50 w-full", height, "bg-border/20", className)}>
      <div
        className={cn("transition-all duration-150 ease-out", height, backgroundColor)}
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}
