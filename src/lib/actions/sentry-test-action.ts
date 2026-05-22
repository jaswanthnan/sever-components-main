'use server';

import * as Sentry from '@sentry/nextjs';

export async function triggerServerActionCrash() {
  try {
    // Intentionally trigger a server-side exception
    throw new Error("Simulated Server Action Crash: Mongoose Connection Timeout (Code: 504)");
  } catch (error) {
    // Explicitly capture in Sentry for testing purposes
    Sentry.captureException(error);
    throw error; // Re-throw to propagate to client-side handler
  }
}
