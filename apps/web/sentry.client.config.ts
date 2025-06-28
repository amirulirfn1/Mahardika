import * as Sentry from '@sentry/nextjs';

/**
 * Initializes Sentry only when running a production build.
 * In development, the SDK is loaded but disabled so that bundle size
 * remains small and noisy error reports are avoided.
 *
 * The DSN should be provided through one of the following env vars:
 *   - NEXT_PUBLIC_SENTRY_DSN   (preferred for browser code)
 *   - SENTRY_DSN               (fallback)
 */
Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || '',

  // Disable all reporting outside production to avoid spam
  enabled: process.env.NODE_ENV === 'production',

  // Capture 100% of transactions – adjust as needed
  tracesSampleRate: 1.0,

  // Session Replay – capture 10% of sessions, 100% with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
}); 