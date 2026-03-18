import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA support
registerSW({ immediate: true });

// Initialize Sentry to track all errors and performance issues
Sentry.init({
  // NOTE: Replace this DSN URL with your actual Sentry DSN!
  dsn: "https://920c920e6b21de08403be944b691fc9c@o4511030752247808.ingest.us.sentry.io/4511030757359616",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Captures 100% of transactions. Adjust in production to save quota.
  // Session Replay
  replaysSessionSampleRate: 0.1, // Captures 10% of sessions for replay viewing
  replaysOnErrorSampleRate: 1.0, // Captures a replay every time an error happens
  // Filter out noisy extension errors
  ignoreErrors: [
    'Attempting to use a disconnected port object',
    'proxy.js',
  ],
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
