# Sentry Integration

This document outlines how Sentry has been integrated into the application to provide error tracking and performance monitoring.

## Features

- **Error Tracking**: Automatic capture of frontend JavaScript errors
- **Performance Monitoring**: Tracking of page load and API request performance
- **User Context**: Association of errors with user information when available
- **Source Maps**: Support for debugging minified production code
- **Error Boundaries**: Prevention of UI crashes with fallback components

## Setup

1. Create a `.env` file in the project root with the following values:

   ```
   VITE_SENTRY_DSN=your-sentry-project-dsn
   VITE_APP_VERSION=1.0.0
   ```

2. For source map uploads to work in production, set the following environment variables:
   ```
   SENTRY_ORG=your-organization-slug
   SENTRY_PROJECT=your-project-slug
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

## Usage

### Tracking User Context

User information is automatically tracked in authenticated routes via the Profile component.

```tsx
// Example: Setting user context manually
import { setUserContext } from "../utils/sentry";

// When a user logs in
setUserContext(userId, {
  email: userEmail,
  username: userName,
});

// When a user logs out
clearUserContext();
```

### Tracking User Actions

The app automatically tracks important user actions for better error context:

```tsx
// Example: Tracking a custom action
import { trackUserAction } from "../utils/sentry";

// When user performs an important action
trackUserAction("added_expense", {
  category: expenseCategory,
  amount: expenseAmount,
});
```

### Capturing Custom Errors

```tsx
// Example: Capturing a custom error
import { captureException } from "../utils/sentry";

try {
  // Your code here
} catch (error) {
  captureException(error, {
    context: "Component name",
    action: "What action was being performed",
    additionalData: "...",
  });
}
```

### Error Boundaries

All routes are wrapped with an ErrorBoundary component to prevent the entire UI from crashing:

```tsx
// Example: Wrapping a component with an error boundary
import ErrorBoundary from "../components/ErrorBoundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

You can also use the HOC for components:

```tsx
// Using the HOC pattern
import { withErrorBoundary } from "../components/ErrorBoundary";

export default withErrorBoundary(YourComponent, {
  fallback: <CustomErrorComponent />,
  name: "ComponentName",
});
```

## Architecture

- `src/utils/sentry.ts`: Core Sentry configuration and utility functions
- `src/components/ErrorBoundary`: React error boundary for UI resilience
- `vite.config.ts`: Source map configuration
- `.env`: Environment-specific Sentry DSN and other keys
