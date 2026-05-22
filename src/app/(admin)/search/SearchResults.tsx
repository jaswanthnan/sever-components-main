import React from 'react';
import { Users, Briefcase, FileText, ChevronRight } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import Job from '@/lib/models/Job';
import type { Candidate as CandidateRecord, Job as JobRecord } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Candidates', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Jobs', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Documents', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((item) => (
          <button key={item.label} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-center space-y-4 group">
            <div className={`mx-auto w-16 h-16 ${item.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8" />
            </div>
            <span className="block font-bold text-slate-900 dark:text-white">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  await dbConnect();
  await delay(1000);

  const regex = new RegExp(query, 'i');

  const [candidates, jobs] = await Promise.all([
    Candidate.find({
      $or: [{ name: regex }, { email: regex }, { role: regex }],
    }).lean<CandidateRecord[]>().limit(10),
    Job.find({
      $or: [{ title: regex }, { department: regex }, { location: regex }],
    }).lean<JobRecord[]>().limit(10),
  ]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Candidates ({candidates.length})
        </h2>
        {candidates.length > 0 ? (
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <div key={candidate._id.toString()} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-600 uppercase">
                    {candidate.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{candidate.name}</p>
                    <p className="text-xs text-slate-500">{candidate.email}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center text-slate-500">
            No candidates found for &quot;{query}&quot;.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          Jobs ({jobs.length})
        </h2>
        {jobs.length > 0 ? (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job._id.toString()} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 transition-all cursor-pointer group">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.department} • {job.location}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center text-slate-500">
            No jobs found for &quot;{query}&quot;.
          </div>
        )}
      </section>
    </div>
  );
}
