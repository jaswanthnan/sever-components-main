import React from 'react';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-100 dark:border-slate-800" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading...</p>
    </div>
  );
}
