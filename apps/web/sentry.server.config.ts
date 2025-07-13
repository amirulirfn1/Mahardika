import * as Sentry from '@sentry/nextjs';

/**
 * Server-side Sentry initialization.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  enabled: process.env.NODE_ENV === 'production',

  tracesSampleRate: 1.0,
});
