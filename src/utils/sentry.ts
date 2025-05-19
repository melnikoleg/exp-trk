// Sentry configuration for error tracking and performance monitoring
import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking and performance monitoring.
 * This should be called before the app renders.
 * 
 * @param userId Optional user ID to associate with Sentry events.
 * @param environment Current environment (development, staging, production).
 */
export const initSentry = (userId?: string, environment = 'production') => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || 'YOUR_DSN_VALUE', // Replace with your actual DSN in environment variables
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Configure which URLs to trace
    tracePropagationTargets: ['localhost', /^\//],
    
    // Capture Replay for 10% of all sessions and 100% of sessions with errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment,
    // Release version helps with source map integration
    release: import.meta.env.VITE_APP_VERSION || 'dev',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // Adjust this value in production as needed
    tracesSampleRate: 1.0,
    // Enable debug in development only
    debug: import.meta.env.DEV,
  });
  
  // If a user is authenticated, set their identity in Sentry
  if (userId) {
    setUserContext(userId);
  }
};

/**
 * Set user context information to track errors by user
 * @param userId User's unique identifier
 * @param additionalData Additional user data like email, name, etc.
 */
export const setUserContext = (userId: string, additionalData: Record<string, any> = {}) => {
  Sentry.setUser({
    id: userId,
    ...additionalData
  });
};

/**
 * Clear user context when a user logs out
 */
export const clearUserContext = () => {
  Sentry.setUser(null);
};

/**
 * Set extra context information for better debugging
 * @param key Context key
 * @param value Context value
 */
export const setExtraContext = (key: string, value: any) => {
  Sentry.setExtra(key, value);
};

/**
 * Track an exception manually
 * @param error Error object
 * @param context Additional context information
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

/**
 * Manually capture a message
 * @param message Message to log
 * @param level Severity level
 */
export const captureMessage = (
  message: string, 
  level: Sentry.SeverityLevel = 'info'
) => {
  Sentry.captureMessage(message, level);
};

/**
 * Track user actions or events
 * @param action Action name
 * @param data Associated data
 */
export const trackUserAction = (action: string, data: Record<string, any> = {}) => {
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: action,
    level: 'info',
    data
  });
};
