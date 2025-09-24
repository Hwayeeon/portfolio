// Performance monitoring utility
export const performanceMonitor = {
  // Core Web Vitals observer
  observeWebVitals() {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      if (lastEntry) {
        console.log("LCP:", lastEntry.startTime);
        // Send to analytics
        if (window.gtag) {
          window.gtag("event", "web_vitals", {
            event_category: "performance",
            event_label: "LCP",
            value: Math.round(lastEntry.startTime),
          });
        }
      }
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const eventEntry = entry as PerformanceEventTiming;
        const fid = eventEntry.processingStart - eventEntry.startTime;
        console.log("FID:", fid);

        if (window.gtag) {
          window.gtag("event", "web_vitals", {
            event_category: "performance",
            event_label: "FID",
            value: Math.round(fid),
          });
        }
      });
    });

    fidObserver.observe({ entryTypes: ["first-input"] });
  },

  // Bundle size monitoring
  logBundleSize() {
    if (typeof window === "undefined") return;

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navigation) {
      const transferSize = navigation.transferSize;
      console.log("Page transfer size:", transferSize, "bytes");

      if (transferSize > 200 * 1024) {
        // > 200KB
        console.warn("Bundle size exceeds recommended 200KB limit");
      }
    }
  },

  // Resource loading monitoring
  logResourceTiming() {
    if (typeof window === "undefined") return;

    const resources = performance.getEntriesByType("resource");
    const slowResources = resources.filter((resource) => resource.duration > 1000);

    if (slowResources.length > 0) {
      console.warn("Slow loading resources:", slowResources);
    }
  },
};

// Auto-initialize in browser
if (typeof window !== "undefined") {
  // Run after page load
  window.addEventListener("load", () => {
    performanceMonitor.observeWebVitals();
    performanceMonitor.logBundleSize();
    performanceMonitor.logResourceTiming();
  });
}
