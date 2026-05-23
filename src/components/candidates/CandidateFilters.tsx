'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, X } from 'lucide-react';
import { useCandidateStore } from '@/store/candidateStore';
import type { CandidateStatusFilter } from '@/types';

const statuses = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'] as const;

interface CandidateFiltersProps {
  initialStatus: CandidateStatusFilter;
}

export default function CandidateFilters({ initialStatus }: CandidateFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = useCandidateStore((state) => state.searchTerm);
  const setSearchTerm = useCandidateStore((state) => state.setSearchTerm);
  const activeFilters = useCandidateStore((state) => state.activeFilters);
  const setFilters = useCandidateStore((state) => state.setFilters);
  const clearFilters = useCandidateStore((state) => state.clearFilters);
  const currentStatus = activeFilters.status?.[0] ?? (initialStatus === 'all' ? null : initialStatus);

  useEffect(() => {
    if (initialStatus === 'all') {
      return;
    }

    if (activeFilters.status?.[0] !== initialStatus) {
      setFilters({ ...activeFilters, status: [initialStatus] });
    }
  }, [activeFilters, initialStatus, setFilters]);

  const setStatusFilter = (status: CandidateStatusFilter) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (status === 'all') {
      params.delete('status');
      const rest = Object.fromEntries(
        Object.entries(activeFilters).filter(([key]) => key !== 'status')
      ) as typeof activeFilters;
      setFilters(rest);
    } else {
      params.set('status', status);
      setFilters({ ...activeFilters, status: [status] });
    }

    const query = params.toString();
    router.push(query ? `/candidates?${query}` : '/candidates');
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Filter className="h-4 w-4 text-indigo-600" />
          Filters
        </div>
        {(currentStatus || searchTerm) && (
          <button
            type="button"
            onClick={() => {
              clearFilters();
              router.push('/candidates');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Search candidates
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Name, email, role, skill..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Application Status
        </h3>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
              currentStatus === null
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            All statuses
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                currentStatus === status
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Experience Level
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {['Junior', 'Mid', 'Senior', 'Lead'].map((level) => (
            <button
              key={level}
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-400"
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
