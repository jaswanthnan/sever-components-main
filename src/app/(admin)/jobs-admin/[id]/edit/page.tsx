import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import JobForm from '@/components/jobs/JobForm';
import type { AdminJobRecord } from '@/components/jobs/JobTable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Job Posting',
  robots: {
    index: false,
    follow: false,
  },
};

type EditJobPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  
  await dbConnect();
  const job = await Job.findById(id).lean();
  
  if (!job) {
    notFound();
  }

  // Format job values into clean AdminJobRecord structure
  const formattedJob: AdminJobRecord = {
    _id: (job as any)._id.toString(),
    title: (job as any).title,
    department: (job as any).department,
    location: (job as any).location,
    type: (job as any).type,
    status: (job as any).status,
    salaryRange: (job as any).salaryRange || '',
    description: (job as any).description || '',
    requirements: (job as any).requirements || [],
    createdAt: (job as any).createdAt ? (job as any).createdAt.toISOString() : new Date().toISOString(),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Job Posting</h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Update the details for this position. Changes will be reflected instantly on the public careers portal.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <JobForm job={formattedJob} />
      </div>
    </div>
  );
}
