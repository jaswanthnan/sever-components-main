import React, { Suspense } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchSkeleton } from './SearchSkeleton';

/**
 * 🔍 CONCEPT: Partial Prerendering (PPR) & Server-Side Streaming
 * This component demonstrates:
 * 1. Static Shell rendering at build time.
 * 2. Dynamic Search Input (Client Component) interacting with URL.
 * 3. Suspense boundary for streaming in Elasticsearch-like results.
 * 4. Shadcn-style skeleton loading UI.
 */

// Opt into PPR by not making the entire page dynamic. Next.js App Router will
// automatically make the Suspense boundary dynamic if it reads searchParams,
// or we can pass searchParams directly as a prop to the page.

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Global Search</h1>
        <p className="text-slate-500 mt-1">Search across candidates, jobs, and documents.</p>
      </div>

      {/* Static Shell / Client Component for Input */}
      <Suspense fallback={
        <div className="relative group">
           <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <SearchIcon className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
           </div>
           <input 
             disabled
             type="text" 
             placeholder="Start typing to search (e.g. Developer)..." 
             className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-[2rem] text-xl font-medium shadow-sm transition-all outline-none"
           />
        </div>
      }>
        <SearchInput />
      </Suspense>

      {/* Dynamic Results streamed in with Suspense and Shadcn Skeleton */}
      <Suspense fallback={<SearchSkeleton />} key={query}>
        <SearchResults query={query} />
      </Suspense>

      {!query && (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <SearchIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Start Searching</h3>
            <p className="text-slate-500">Enter a name, job title, or keyword above.</p>
          </div>
        </div>
      )}
    </div>
  );
}
