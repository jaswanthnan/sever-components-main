'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

const statuses = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];

export default function CandidateFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams?.get('status');

  const setFilter = (status: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    router.push(`/candidates?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Filter className="w-4 h-4 text-indigo-600" />
          Filters
        </div>
        {currentStatus && (
          <button 
            onClick={() => setFilter(null)}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Application Status</h3>
        <div className="space-y-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentStatus === status 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Experience Level</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Junior', 'Mid', 'Senior', 'Lead'].map((level) => (
            <button key={level} className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
