// src/hooks/useOptimizedHandlers.ts
import { useCallback, useMemo, DependencyList, useRef } from 'react';

/**
 * Creates a memoized callback with added performance tracking
 * 
 * @param callback The callback function to memoize
 * @param deps Dependencies array for the callback
 * @param name Optional name for tracking
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
  name?: string
): T {
  // Track when this callback is recreated
  const isFirstRender = useFirstRenderTracker();
  
  if (!isFirstRender && process.env.NODE_ENV === 'development' && name) {
    console.log(`[Optimization Warning] ${name} callback recreated`);
  }
  
  return useCallback(callback, deps);
}

/**
 * Creates a memoized value with added performance tracking
 * 
 * @param factory Function that creates the value
 * @param deps Dependencies array for the value
 * @param name Optional name for tracking
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: DependencyList,
  name?: string
): T {
  // Track when this value is recalculated
  const isFirstRender = useFirstRenderTracker();
  
  if (!isFirstRender && process.env.NODE_ENV === 'development' && name) {
    console.log(`[Optimization Warning] ${name} value recalculated`);
  }
  
  return useMemo(factory, deps);
}

/**
 * Helper hook to track first render
 */
function useFirstRenderTracker(): boolean {
  const ref = useRef(true);
  
  const isFirstRender = ref.current;
  if (ref.current) {
    ref.current = false;
  }
  
  return isFirstRender;
}
