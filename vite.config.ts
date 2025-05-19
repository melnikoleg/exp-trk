import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Sentry plugin for source map generation and upload
    sentryVitePlugin({
      org: process.env.SENTRY_ORG || "your-org-name",
      project: process.env.SENTRY_PROJECT || "exp-trk",
      // Auth token can be obtained from Sentry dashboard
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Only upload source maps in production builds
      disable: process.env.NODE_ENV !== "production",

      // Automatically upload source maps
      sourcemaps: {
        // Include source maps in your build assets directory
        assets: "./dist/**",
      },

      // Specify the release version - use the same value as in Sentry.init()
      release: {
        name:
          process.env.VITE_APP_VERSION || `exp-trk@${new Date().toISOString()}`,
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        importers: [],
      },
    },
  },
  // Make sure to generate source maps in production
  build: {
    sourcemap: true,
  },
});
