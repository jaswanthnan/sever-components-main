import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import CandidateTable from '@/components/candidates/CandidateTable';
import CandidateFilters from '@/components/candidates/CandidateFilters';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Candidate as CandidateRecord } from '@/types';

/**
 * 📌 Metadata API — Admin page (noindex)
 * Prevents Google from indexing the private candidate management panel.
 * HOW TO SEE: View page source → <meta name="robots" content="noindex,nofollow">
 */
export const metadata: Metadata = {
  title: 'Candidates',
  robots: {
    index: false,
    follow: false,
  },
};

// 1. Beautiful Shadcn-style Loading Placeholder for the Table
function CandidatesTableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm w-full animate-in fade-in duration-300">
      {/* Table Header Row Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Row Skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 2. Data Fetching Server Component (Nested inside Suspense)
type CandidateSearchParams = {
  status?: string | string[];
};

async function CandidateTableWrapper({ params }: { params: CandidateSearchParams }) {
  await dbConnect();
  
  // Artificial delay to let you see the beautiful React Suspense Streaming in action!
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const query: Record<string, string> = {};
  if (typeof params.status === 'string') {
    query.status = params.status;
  }

  const candidates = await Candidate.find(query).sort({ createdAt: -1 }).lean<CandidateRecord[]>();

  return <CandidateTable initialData={JSON.parse(JSON.stringify(candidates))} />;
}

// 3. Main Page Shell (Renders Instantly without waiting for DB)
export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link
          href="/candidates/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Candidate
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters load instantly */}
        <div className="lg:col-span-1">
          <CandidateFilters />
        </div>
        
        {/* Table streams in asynchronously under React Suspense boundary */}
        <div className="lg:col-span-3">
          <Suspense fallback={<CandidatesTableSkeleton />} key={params.status?.toString()}>
            <CandidateTableWrapper params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
