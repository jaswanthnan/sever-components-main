import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    // Intentionally trigger a crash in the API route
    throw new Error("Simulated API Crash: Uncaught NullPointerException in /api/sentry-error");
  } catch (error) {
    // Record to Sentry
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Simulated API route crash was recorded in Sentry." },
      { status: 500 }
    );
  }
}
