import type { Metadata } from 'next';
import Link from 'next/link';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Candidate from '@/lib/models/Candidate';
import dbConnect from '@/lib/mongodb';
import CandidateFilters from '@/components/candidates/CandidateFilters';
import CandidateTable from '@/components/candidates/CandidateTable';
import { candidateQueryKeys, getCandidateStatusParam } from '@/lib/candidate-queries';
import { getQueryClient } from '@/lib/react-query';
import type { Candidate as CandidateRecord } from '@/types';

export const metadata: Metadata = {
  title: 'Candidates',
  robots: {
    index: false,
    follow: false,
  },
};

function serializeCandidates(candidates: CandidateRecord[]) {
  return JSON.parse(JSON.stringify(candidates)) as CandidateRecord[];
}

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = getCandidateStatusParam(params.status);

  await dbConnect();

  const queryClient = getQueryClient();
  const query = status === 'all' ? {} : { status };
  const candidates = serializeCandidates(
    await Candidate.find(query).sort({ createdAt: -1 }).lean<CandidateRecord[]>()
  );

  queryClient.setQueryData(candidateQueryKeys.list(status), candidates);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Candidates
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Server-prefetched candidate data hydrated into TanStack Query on the client.
            </p>
          </div>

          <Link
            href="/candidates/new"
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition-all active:scale-95 hover:bg-indigo-700 dark:shadow-none"
          >
            <Plus className="h-5 w-5" />
            Add Candidate
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <CandidateFilters initialStatus={status} />
          </div>
          <div className="lg:col-span-3">
            <CandidateTable status={status} />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
