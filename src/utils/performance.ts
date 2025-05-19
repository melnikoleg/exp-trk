// src/utils/performance.ts
export interface PerformanceMetric {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

// Store render metrics for analysis
const renderMetrics: PerformanceMetric[] = [];

// Maximum number of metrics to keep in memory
const MAX_METRICS = 100;

/**
 * Track component render performance
 * @param componentName Name of the component being measured
 * @param renderTime Time taken to render in ms
 */
export const trackRenderPerformance = (
  componentName: string,
  renderTime: number,
): void => {
  const metric: PerformanceMetric = {
    componentName,
    renderTime,
    timestamp: Date.now(),
  };

  renderMetrics.push(metric);

  // Keep the array at a reasonable size
  if (renderMetrics.length > MAX_METRICS) {
    renderMetrics.shift();
  }

  // Log to console for development
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`,
    );
  }
};

/**
 * Get all recorded performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetric[] => {
  return [...renderMetrics];
};

/**
 * Get average render time for a component
 */
export const getAverageRenderTime = (componentName: string): number => {
  const componentMetrics = renderMetrics.filter(
    (m) => m.componentName === componentName,
  );

  if (componentMetrics.length === 0) {
    return 0;
  }

  const sum = componentMetrics.reduce(
    (acc, metric) => acc + metric.renderTime,
    0,
  );
  return sum / componentMetrics.length;
};

/**
 * Clear all performance metrics
 */
export const clearPerformanceMetrics = (): void => {
  renderMetrics.length = 0;
};
