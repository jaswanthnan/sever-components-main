'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Search,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'Jobs', href: '/jobs-admin', icon: Briefcase },
  { name: 'Search', href: '/search', icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-30",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-16 border-b border-slate-200 dark:border-slate-800" />

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href) ?? false;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
              )} />
              {!isCollapsed && <span>{item.name}</span>}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
