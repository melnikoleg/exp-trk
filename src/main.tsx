import './wdyr'; // <-- This must be first import

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import StoreProvider from "./store/storeContext";
import "./index.css";
import App from "./components/App";
import { initSentry } from "./utils/sentry";
import ErrorBoundary from "./components/ErrorBoundary";

initSentry(undefined, import.meta.env.MODE);

window.addEventListener("error", (event) => {
  Sentry.captureException(event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  Sentry.captureException(event.reason);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ErrorBoundary>
  </StrictMode>,
);
