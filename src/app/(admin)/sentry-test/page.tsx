'use client';

import React, { useState } from 'react';
import { triggerServerActionCrash } from '@/lib/actions/sentry-test-action';
import { ShieldAlert, Zap, Server, Terminal, Flame, Info, CheckCircle2 } from 'lucide-react';

export default function SentryTestPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleClientCrash = () => {
    setResult({ type: 'success', message: 'Client crash triggered! Check browser console and Sentry dashboard.' });
    // Intentionally trigger a standard Javascript runtime ReferenceError
    setTimeout(() => {
      // @ts-ignore - intentional undefined function call
      myUndefinedFunction();
    }, 100);
  };

  const handleServerActionCrash = async () => {
    setLoading('server-action');
    setResult(null);
    try {
      await triggerServerActionCrash();
    } catch (error: any) {
      setResult({
        type: 'error',
        message: `Server Action failed (Caught on client): ${error.message || 'Error occurred'}`
      });
    } finally {
      setLoading(null);
    }
  };

  const handleApiCrash = async () => {
    setLoading('api');
    setResult(null);
    try {
      const res = await fetch('/api/sentry-error');
      const data = await res.json();
      if (!res.ok) {
        setResult({
          type: 'error',
          message: `API Route failed with status ${res.status}: ${data.message || data.error}`
        });
      } else {
        setResult({ type: 'success', message: 'API responded successfully (Should not happen).' });
      }
    } catch (error: any) {
      setResult({ type: 'error', message: `Fetch Error: ${error.message}` });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sentry Testing Laboratory
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-sm font-medium">
          A premium dashboard built to verify error boundaries, telemetry capture, and logging pipelines across client and server runtimes in HireSync CRM.
        </p>
      </div>

      {/* Info card */}
      <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-950/40 rounded-3xl p-5 flex gap-4">
        <Info className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">How to verify Sentry logging:</h4>
          <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed font-medium">
            When you trigger a crash below, the exception will be captured automatically by the Sentry SDK.
            If you are running in production with a valid <code>SENTRY_DSN</code> in your environment variables,
            the crash will report to your Sentry dashboard in under 5 seconds with full stack traces, file line numbers, and device details.
          </p>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`p-5 rounded-3xl border animate-in fade-in zoom-in-95 duration-200 flex gap-3.5 ${result.type === 'error'
            ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/20 text-rose-700 dark:text-rose-400'
            : 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-700 dark:text-emerald-400'
          }`}>
          {result.type === 'error' ? (
            <Flame className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold uppercase tracking-wider">{result.type === 'error' ? 'Crash Intercepted' : 'Action Logged'}</h4>
            <p className="text-xs font-medium leading-relaxed">{result.message}</p>
          </div>
        </div>
      )}

      {/* Main Grid of Test Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Crash Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Client-Side Crash
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Simulate an unhandled Javascript exception in the browser. Tests Sentry's client-side window monitoring and source mapping integrations.
            </p>
          </div>
          <button
            onClick={handleClientCrash}
            className="mt-6 w-full py-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Trigger Client Crash
          </button>
        </div>

        {/* Server Action Crash Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Server Action Crash
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Execute a Server Action that crashes when writing to Mongoose. Tests server-side runtime tracking, environment parameters, and catch blocks.
            </p>
          </div>
          <button
            onClick={handleServerActionCrash}
            disabled={loading !== null}
            className="mt-6 w-full py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading === 'server-action' ? 'Executing Server Action...' : 'Trigger Server Action Crash'}
          </button>
        </div>

        {/* API Route Crash Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/20 text-purple-500 rounded-2xl flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              API Route Crash
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Request an API endpoint `/api/sentry-error` that generates an unhandled 500 server crash. Tests server route-handler auto-telemetry.
            </p>
          </div>
          <button
            onClick={handleApiCrash}
            disabled={loading !== null}
            className="mt-6 w-full py-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading === 'api' ? 'Requesting API...' : 'Trigger API Route Crash'}
          </button>
        </div>
      </div>
    </div>
  );
}
