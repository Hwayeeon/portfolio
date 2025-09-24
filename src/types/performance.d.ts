// Add PerformanceEventTiming interface declaration
declare global {
  interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
    startTime: number;
  }

  interface Window {
    gtag?: (
      command: "event",
      action: string,
      parameters: {
        event_category: string;
        event_label: string;
        value: number;
      }
    ) => void;
  }
}
