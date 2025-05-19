import { Component, ReactNode, useState } from 'react';
import * as Sentry from '@sentry/react';
import { captureException } from '../../utils/sentry';
import { Button } from '../Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    captureException(error, { 
      errorInfo: errorInfo.componentStack || 'No component stack available',
      component: errorInfo.componentStack 
        ? (errorInfo.componentStack.split('\n')[1]?.trim() || 'Unknown') 
        : 'Unknown'
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <ErrorFallback error={this.state.error} reset={() => {
        this.setState({ hasError: false, error: null });
      }} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  reset: () => void;
}

/**
 * Default fallback component displayed when an error occurs
 */
const ErrorFallback = ({ error, reset }: ErrorFallbackProps) => {
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      borderRadius: '4px', 
      backgroundColor: '#fff4f4', 
      border: '1px solid #ffcdd2',
      textAlign: 'center' 
    }}>
      <h2>Something went wrong</h2>
      {error && <p style={{ color: '#d32f2f' }}>{error.message}</p>}
      <div style={{ marginTop: '20px' }}>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
};

/**
 * Higher-order component (HOC) for wrapping components with Sentry's performance monitoring
 * and error tracking functionality.
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    name?: string;
  }
) => {
  const { name = Component.displayName || Component.name } = options || {};
  
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary fallback={options?.fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `WithErrorBoundary(${name})`;
  return WrappedComponent;
};

export default ErrorBoundary;
