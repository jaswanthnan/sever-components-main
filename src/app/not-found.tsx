import React from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="relative">
          <h1 className="text-[8rem] font-black text-slate-100 dark:text-slate-800/50 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 bg-indigo-600 rounded-3xl rotate-12 flex items-center justify-center text-white shadow-xl">
              <Search className="w-12 h-12" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Lost in Space?</h2>
          <p className="text-slate-500 font-medium px-4">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to another dimension.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            Go back Dashboard
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 py-2"
          >
            Browse Public Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
