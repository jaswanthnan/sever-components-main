'use client';

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
      } else {
        router.push('/search', { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router]);

  return (
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <SearchIcon className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing to search (e.g. Developer)..." 
        className="w-full pl-16 pr-8 py-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-[2rem] text-xl font-medium shadow-sm transition-all outline-none"
      />
    </div>
  );
}
