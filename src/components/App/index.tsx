import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import Main from "../../pages/Main";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
import ForgotPassword from "../../pages/ForgotPassword";
import VerificationCode from "../../pages/VerificationCode";
import RestorePassword from "../../pages/RestorePassword";
import Success from "../../pages/Success";
import Profile from "../../pages/Profile";
import AuthLayout from "../AuthLayout";
import PrivateRoute from "../../routes/PrivateRoute";
import { initAuth } from "../../utils/auth";
import { useStore } from "../../store/storeContext";
import { trackUserAction } from "../../utils/sentry";
import ErrorBoundary from "../ErrorBoundary";
import DevTools from "../DevTools";

// Add Sentry routing instrumentation
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

// Navigation tracking component to monitor route changes
const NavigationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page navigation for better error context
    trackUserAction("navigation", {
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);

  return null;
};

function App() {
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated } = useStore();

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const isAuth = await initAuth();
        setIsAuthenticated(isAuth);
        trackUserAction("auth_status", { isAuthenticated: isAuth });
      } catch (error) {
        console.error("Auth initialization failed:", error);
        Sentry.captureException(error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, [setIsAuthenticated]);

  if (loading) {
    return <div className="app-loading">Initializing...</div>;
  }

  return (
    <BrowserRouter>
      <NavigationTracker />
      <ErrorBoundary>
        <SentryRoutes>
          {/* Protected routes - require authentication */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Public routes - accessible to all users */}
          <Route element={<AuthLayout />}>
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verification-code" element={<VerificationCode />} />
            <Route path="restore-password" element={<RestorePassword />} />
            <Route path="success" element={<Success />} />
          </Route>
        </SentryRoutes>
      </ErrorBoundary>
      {/* Performance DevTools - only visible in development */}
      {process.env.NODE_ENV === "development" && <DevTools />}
    </BrowserRouter>
  );
}

export default App;
