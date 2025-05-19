// src/utils/withMemoization.tsx
import React from 'react';
import { useRenderMetrics } from '../hooks/useRenderMetrics';

/**
 * Higher-order component that memoizes a component and tracks its render metrics
 * @param Component The component to memoize
 * @param displayName Optional name for the component in devtools
 */
export function withMemoization<T>(
  Component: React.ComponentType<T>,
  displayName?: string
): React.MemoExoticComponent<React.ComponentType<T>> {
  // Create a wrapper component that tracks render metrics
  const MemoizedWithTracking = (props: T) => {
    // Use the component's display name or fallback to the function name
    const componentName = displayName || Component.displayName || Component.name || 'UnknownComponent';
    
    // Track render metrics for this component
    useRenderMetrics(componentName);
    
    return <Component {...props} />;
  };

  // Set appropriate display name for DevTools
  MemoizedWithTracking.displayName = `Memoized(${displayName || Component.displayName || Component.name || 'Component'})`;
  
  // Apply React.memo for memoization
  return React.memo(MemoizedWithTracking);
}

/**
 * Adds whyDidYouRender tracking to a component for debugging renders
 * @param Component The component to track
 */
export function withRenderTracking(Component: React.ComponentType<any>): React.ComponentType<any> {
  // Only apply in development
  if (process.env.NODE_ENV === 'development') {
    Component.whyDidYouRender = true;
  }
  return Component;
}
