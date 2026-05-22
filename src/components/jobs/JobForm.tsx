'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createJob, updateJob } from '@/lib/actions/job-actions';
import { Loader2, Save, X, ChevronDown } from 'lucide-react';
import type { FormState } from '@/types';
import type { AdminJobRecord } from '@/components/jobs/JobTable';

const initialState: FormState = {
  message: null,
  error: null,
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-[0.98] cursor-pointer"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Save className="w-5 h-5" />
          {isEdit ? 'Update Job Posting' : 'Post Job Posting'}
        </>
      )}
    </button>
  );
}

export default function JobForm({ job }: { job?: AdminJobRecord }) {
  const router = useRouter();
  const isEdit = !!job;
  const action = job ? updateJob.bind(null, job._id) : createJob;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Title</label>
          <input
            required
            name="title"
            type="text"
            defaultValue={job?.title || ''}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Department</label>
          <input
            required
            name="department"
            type="text"
            defaultValue={job?.department || ''}
            placeholder="e.g. Engineering, Product, Sales"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Type</label>
          <div className="relative">
            <select
              required
              name="type"
              defaultValue={job?.type || 'Full-time'}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Status</label>
          <div className="relative">
            <select
              required
              name="status"
              defaultValue={job?.status || 'Open'}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
          <input
            required
            name="location"
            type="text"
            defaultValue={job?.location || ''}
            placeholder="e.g. New York, NY or Remote"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Salary Range</label>
          <input
            name="salaryRange"
            type="text"
            defaultValue={job?.salaryRange || ''}
            placeholder="e.g. $120k - $150k"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Description</label>
        <textarea
          required
          name="description"
          rows={5}
          defaultValue={job?.description || ''}
          placeholder="Enter detailed role responsibilities and team context..."
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Role Requirements</label>
          <span className="text-xs text-slate-500 dark:text-slate-400">Enter each requirement on a new line.</span>
        </div>
        <textarea
          required
          name="requirements"
          rows={5}
          defaultValue={job?.requirements ? job.requirements.join('\n') : ''}
          placeholder="e.g. 5+ years of experience with React&#10;Strong understanding of TypeScript and CSS&#10;Excellent communication skills..."
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {state?.error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium border border-rose-100 dark:border-rose-900/30 animate-in fade-in zoom-in-95">
          {state.error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-bold transition-all active:scale-[0.98] cursor-pointer"
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
