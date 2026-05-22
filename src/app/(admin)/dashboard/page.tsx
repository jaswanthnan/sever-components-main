/**
 * 📌 OPTIMIZATIONS APPLIED ON THIS PAGE:
 * 
 * 1. Lazy Loading with next/dynamic (Bundle Size Reduction)
 *    - RecruitmentAnalytics uses Recharts — a ~200KB library
 *    - Without lazy loading: Recharts is bundled into the initial JS chunk
 *    - With dynamic(): Recharts only loads AFTER the page first renders
 *    
 *    HOW TO SEE:
 *    - Open DevTools → Network tab → filter JS
 *    - Page loads fast (no Recharts in initial bundle)
 *    - After ~100ms, you see the chart chunk load separately
 * 
 * 2. RecentCandidates is also lazy loaded (secondary content, loads after primary)
 * 
 * 3. Skeleton fallbacks shown while components load — prevents layout shift (CLS)
 */

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ──────────────────────────────────────────────────────────────
// 📌 LAZY LOADING — next/dynamic
// 
// RecruitmentAnalytics uses Recharts (~200KB).
// By wrapping it in dynamic(), it's split into a separate chunk.
// The ssr: false means it only renders in the browser (chart libraries
// often don't support SSR anyway due to window/document usage).
// 
// The loading fallback is shown while the chunk downloads — this
// prevents layout shift (CLS) by reserving the same space.
// ──────────────────────────────────────────────────────────────
const RecruitmentAnalytics = dynamic(
  () => import('@/components/dashboard/RecruitmentAnalytics'),
  {
    // ssr: false is NOT allowed in Server Components (Next.js 16)
    // Recharts renders SVG — works fine on server
    loading: () => (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-full shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
        {/* Chart area skeleton */}
        <div className="h-[350px] w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-end gap-2 px-4 pb-4">
          {[40, 65, 45, 80, 55, 70, 35, 90, 60, 75, 50, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
  }
);

// RecentCandidates is secondary content — lazy load it too
const RecentCandidates = dynamic(
  () => import('@/components/dashboard/RecentCandidates'),
  {
    loading: () => (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2.5 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
            <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>
    ),
  }
);

/**
 * 📌 Metadata API — Admin page should NOT be indexed by search engines
 * HOW TO SEE: View source → <meta name="robots" content="noindex, nofollow">
 */
export const metadata = {
  title: 'Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

import { connection } from 'next/server';

export default async function DashboardPage() {
  await connection();
  const lastFetch = new Date().toLocaleTimeString();

  const stats = [
    { name: 'Total Candidates', value: '2,840', change: '+12.5%', icon: Users, trend: 'up' },
    { name: 'Active Jobs', value: '45', change: '+3.2%', icon: Briefcase, trend: 'up' },
    { name: 'Interviews Scheduled', value: '128', change: '-2.4%', icon: Clock, trend: 'down' },
    { name: 'Hiring Rate', value: '68%', change: '+5.4%', icon: TrendingUp, trend: 'up' },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SSR indicator */}
      <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500 text-white rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">Dynamic Rendering Mode (SSR)</p>
            <p className="text-sm text-rose-500/80 font-medium">Data refreshed on every request</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Last Server Render</p>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{lastFetch}</p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────
          📌 Lazy Loading indicator
          The chart below is loaded LAZILY — watch DevTools → Network
          tab to see the Recharts chunk load separately after page render.
          ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 px-4 py-2.5 rounded-xl">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          📦 Lazy Loaded
        </span>
        <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">
          RecruitmentAnalytics (Recharts ~200KB) and RecentCandidates load separately — check Network tab
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500">{stat.name}</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* ⬇ This loads lazily! Watch the Network tab */}
          <RecruitmentAnalytics />
        </div>
        <div className="lg:col-span-1">
          {/* ⬇ This also loads lazily */}
          <RecentCandidates />
        </div>
      </div>
    </div>
  );
}
