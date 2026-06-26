import * as Sentry from "@sentry/react";

export const monitoring = {
  init: () => {
    const dsn = import.meta.env.VITE_SENTRY_DSN || "https://demo@sentry.io/demo";
    try {
      Sentry.init({
        dsn,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, 
        tracePropagationTargets: ["localhost"],
        // Session Replay
        replaysSessionSampleRate: 0.1, 
        replaysOnErrorSampleRate: 1.0, 
        environment: import.meta.env.MODE || "development"
      });
      console.log(`[Monitoring] Sentry initialized successfully`);
    } catch (e) {
      console.warn("Failed to initialize Sentry:", e);
    }
  },

  captureException: (error: any, context: string = "") => {
    console.error(`[Captured Exception] ${context}:`, error);
    try {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setTag("context", context);
        }
        Sentry.captureException(error);
      });
    } catch (e) {
      // Graceful fallback
    }
  }
};
