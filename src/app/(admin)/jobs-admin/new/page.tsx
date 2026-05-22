import React from 'react';
import JobForm from '@/components/jobs/JobForm';

export default function NewJobPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Post a New Position</h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Create a new job posting that will be displayed instantly on your public careers portal.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <JobForm />
      </div>
    </div>
  );
}
