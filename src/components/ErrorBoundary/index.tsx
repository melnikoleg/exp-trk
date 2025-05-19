import React, { ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";

/**
 * Higher-order component (HOC) for wrapping components with error boundary functionality.
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    name?: string;
  },
) => {
  // Create a wrapper component with proper display name handling
  const WrappedWithErrorBoundary = React.forwardRef<unknown, P>(
    (props, ref) => {
      const componentProps = { ...props, ref } as P;
      return (
        <ErrorBoundary fallback={options?.fallback}>
          <Component {...componentProps} />
        </ErrorBoundary>
      );
    },
  );

  // Set display name for better debugging and React DevTools
  const name =
    options?.name || Component.displayName || Component.name || "Component";
  WrappedWithErrorBoundary.displayName = `WithErrorBoundary(${name})`;

  return WrappedWithErrorBoundary;
};

export default ErrorBoundary;
