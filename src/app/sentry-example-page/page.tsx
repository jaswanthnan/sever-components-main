'use client';

import React from 'react';
import { ShieldAlert, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SentryExamplePage() {
  const triggerError = () => {
    // Intentionally call a function that does not exist
    // @ts-expect-error - intentional undefined function call for Sentry verification
    myUndefinedFunction();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-3xl text-indigo-600 dark:text-indigo-400 animate-bounce">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Sentry Verification
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Verify your integration by calling an undefined function on the client runtime.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <button
            onClick={triggerError}
            className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-rose-600/20 cursor-pointer"
          >
            <Zap className="w-5 h-5" />
            Trigger `myUndefinedFunction()`
          </button>

          <Link
            href="/sentry-test"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 px-6 rounded-2xl font-bold transition-all cursor-pointer text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Testing Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
