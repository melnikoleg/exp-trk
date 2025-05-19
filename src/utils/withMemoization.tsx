// src/utils/withMemoization.tsx
import React, { ComponentType } from 'react';
import { useRenderMetrics } from '../hooks/useRenderMetrics';

// Define a type for components with whyDidYouRender property
type ComponentWithWhyDidYouRender<P = Record<string, unknown>> = ComponentType<P> & {
  whyDidYouRender?: boolean;
}

/**
 * Higher-order component that memoizes a component and tracks its render metrics
 * @param Component The component to memoize
 * @param displayName Optional name for the component in devtools
 */
export function withMemoization<T = Record<string, unknown>>(
  Component: ComponentType<T>,
  displayName?: string
) {
  // Create a wrapper component that tracks render metrics
  const MemoizedWithTracking = (props: React.PropsWithChildren<T>) => {
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
export function withRenderTracking<P>(Component: ComponentWithWhyDidYouRender<P>): ComponentWithWhyDidYouRender<P> {
  // Only apply in development
  if (process.env.NODE_ENV === 'development') {
    Component.whyDidYouRender = true;
  }
  return Component;
}
