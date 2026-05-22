'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Bell, LogOut, Shield } from 'lucide-react';
import type { AppUser } from '@/types';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as AppUser | undefined;
  
  // Map path to page name
  const pageName = pathname === '/dashboard' ? 'Dashboard'
                 : pathname?.startsWith('/candidates') ? 'Candidates'
                 : pathname?.startsWith('/jobs') ? 'Jobs'
                 : pathname?.startsWith('/search') ? 'Search'
                 : '';

  return (
    <header className="h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{pageName}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* User profile & details */}
        {user && (
          <div className="flex items-center gap-3 pr-3 border-r border-slate-200 dark:border-slate-800">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {user.name}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-1">
                {user.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                {user.role || 'User'}
              </span>
            </div>
            
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20 shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        )}

        <button className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>

        {session && (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
