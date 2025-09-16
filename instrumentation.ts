import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side configuration
    Sentry.init({
      dsn: "https://ec8d521dbb623f96d6e68c8b44f99edb@o4507115129012224.ingest.us.sentry.io/4507115130191872",
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
      
      // uncomment the line below to enable Spotlight (https://spotlightjs.com)
      // spotlight: process.env.NODE_ENV === 'development',
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime configuration
    Sentry.init({
      dsn: "https://ec8d521dbb623f96d6e68c8b44f99edb@o4507115129012224.ingest.us.sentry.io/4507115130191872",
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });
  }
}

// Export the request error hook for error instrumentation
export const onRequestError = Sentry.captureRequestError;
