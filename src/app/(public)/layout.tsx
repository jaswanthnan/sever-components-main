'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BriefcaseBusiness } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <nav className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <Link href="/jobs" className="flex items-center gap-3">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <BriefcaseBusiness className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hire<span className="text-indigo-600">Sync</span> Careers
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600">Admin Portal</Link>
              <Link href="/login">
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 dark:shadow-none hover:scale-105 transition-all active:scale-95 cursor-pointer">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </nav>
      )}
      <main className="flex-1 flex flex-col justify-center">
        {children}
      </main>
      {!isAuthPage && (
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm font-medium">
            © 2024 HireSync. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}

