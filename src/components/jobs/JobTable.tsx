'use client';

import React from 'react';
import Link from 'next/link';
import { Edit, Trash2, MapPin, Briefcase, DollarSign } from 'lucide-react';
import type { Job } from '@/types';

interface JobTableProps {
  jobs: Job[];
  onDelete?: (id: string) => Promise<void> | void;
}

export default function JobTable({ jobs, onDelete }: JobTableProps) {
  const handleDeleteClick = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the job posting for "${title}"?`)) {
      if (onDelete) {
        await onDelete(id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <th className="py-5 px-8 text-xs font-bold uppercase tracking-wider text-slate-500">Job Title</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Department</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Location</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="py-5 px-8 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {jobs.map((job) => (
              <tr 
                key={job._id}
                className="hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors duration-200 group"
              >
                <td className="py-6 px-8">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                      {job.title}
                    </span>
                    {job.salaryRange && (
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                        {job.salaryRange}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-6 px-6">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold border border-indigo-100/30 dark:border-indigo-900/30">
                    {job.department}
                  </span>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.type}
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </div>
                </td>
                <td className="py-6 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    job.status === 'Open'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 dark:border-emerald-900/20'
                      : job.status === 'Draft'
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/20 dark:border-amber-900/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/jobs-admin/${job._id}/edit`}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-all cursor-pointer"
                      title="Edit Job"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => handleDeleteClick(job._id, job.title)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500 font-medium">
                  No job postings found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
