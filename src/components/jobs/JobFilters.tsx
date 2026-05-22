'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

const statuses = ['Open', 'Closed', 'Draft'];
const types = ['Full-time', 'Part-time', 'Contract', 'Remote'];

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams?.get('status');
  const currentType = searchParams?.get('type');

  const setFilter = (key: 'status' | 'type', value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/jobs-admin?${params.toString()}`);
  };

  const clearAll = () => {
    router.push('/jobs-admin');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Filter className="w-4 h-4 text-indigo-600" />
          Filters
        </div>
        {(currentStatus || currentType) && (
          <button 
            onClick={clearAll}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Job Status</h3>
        <div className="space-y-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter('status', status)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentStatus === status 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Job Type</h3>
        <div className="space-y-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter('type', type)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentType === type 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
