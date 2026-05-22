import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import JobTable from '@/components/jobs/JobTable';
import JobFilters from '@/components/jobs/JobFilters';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import type { AdminJobRecord } from '@/components/jobs/JobTable';

export const metadata: Metadata = {
  title: 'Manage Jobs',
  robots: {
    index: false,
    follow: false,
  },
};

function JobsTableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-55 dark:border-slate-800/50 last:border-0 animate-pulse">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

type JobSearchParams = {
  status?: string;
  type?: string;
};

async function JobTableWrapper({ params }: { params: JobSearchParams }) {
  await dbConnect();

  const query: Record<string, string> = {};
  if (params.status) query.status = params.status;
  if (params.type) query.type = params.type;

  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();

  const formattedJobs: AdminJobRecord[] = jobs.map((job: any) => ({
    _id: job._id.toString(),
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
    status: job.status,
    salaryRange: job.salaryRange || '',
    createdAt: job.createdAt.toISOString(),
  }));

  return <JobTable initialData={formattedJobs} />;
}

export default async function JobsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Active Job Openings</h2>
          <p className="text-xs text-slate-500 mt-1">Manage and track your published positions on the HireSync Careers page.</p>
        </div>
        <Link
          href="/jobs-admin/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Post Job
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <JobFilters />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<JobsTableSkeleton />} key={`${params.status}-${params.type}`}>
            <JobTableWrapper params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
