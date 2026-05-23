import React from 'react';
import { Mail } from 'lucide-react';
import type { CandidateStatus } from '@/types';

const candidates = [
  { name: 'Sarah Wilson', role: 'Product Designer', status: 'Interviewing', image: 'SW' },
  { name: 'James Chen', role: 'Fullstack Engineer', status: 'Applied', image: 'JC' },
  { name: 'Elena Rodriguez', role: 'Marketing Manager', status: 'Offered', image: 'ER' },
  { name: 'Alex Thompson', role: 'Data Scientist', status: 'Screening', image: 'AT' },
  { name: 'Mila Kunis', role: 'Frontend Developer', status: 'Hired', image: 'MK' },
] as const satisfies ReadonlyArray<{ name: string; role: string; status: CandidateStatus; image: string }>;

const statusStyles: Record<CandidateStatus, string> = {
  Applied: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  Screening: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  Interviewing: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  Offered: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  Rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
  Hired: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
};

interface RecentCandidatesProps {
  initialCandidates?: ReadonlyArray<{ name: string; role: string; status: CandidateStatus; image: string }>;
}

export default function RecentCandidates({ initialCandidates }: RecentCandidatesProps) {
  const displayCandidates = initialCandidates || candidates;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Candidates</h2>
        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
      </div>

      <div className="space-y-6">
        {displayCandidates.map((candidate, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all animate-in fade-in duration-300">
                {candidate.image}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white leading-tight">{candidate.name}</p>
                <p className="text-xs text-slate-500 mt-1">{candidate.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusStyles[candidate.status]}`}>
                {candidate.status}
              </span>
              <button className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
