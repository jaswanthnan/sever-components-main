'use client';

import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="h-20 w-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center mx-auto text-rose-500">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Something went wrong</h2>
          <p className="text-slate-500 font-medium">
            {error.message || 'An unexpected error occurred. Please try again or contact support.'}
          </p>
        </div>
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all active:scale-95"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
