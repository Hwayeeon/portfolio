"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/lib/performance")
        .then((module) => {
          // Initialize performance monitoring
          if (module.performanceMonitor) {
            module.performanceMonitor.observeWebVitals();
            module.performanceMonitor.logBundleSize();
            module.performanceMonitor.logResourceTiming();
          }
        })
        .catch((error) => {
          console.warn("Failed to load performance monitoring:", error);
        });
    }
  }, []);

  // This component doesn't render anything
  return null;
}
