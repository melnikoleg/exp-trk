// src/hooks/useRenderMetrics.ts
import { useRef, useEffect } from "react";
import { trackRenderPerformance } from "../utils/performance";

/**
 * Hook to measure and track component render performance
 * @param componentName Name of the component to track
 */
export const useRenderMetrics = (componentName: string): void => {
  const renderStartTime = useRef<number>(0);

  // Track when the component starts rendering
  renderStartTime.current = performance.now();

  useEffect(() => {
    // Calculate how long the render took
    const renderTime = performance.now() - renderStartTime.current;
    trackRenderPerformance(componentName, renderTime);
  });
};
