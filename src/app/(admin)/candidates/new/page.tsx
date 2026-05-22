import React from 'react';
import CandidateForm from '@/components/candidates/CandidateForm';

export default function NewCandidatePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Candidate</h1>
        <p className="text-slate-500 mt-2">Enter the candidate&apos;s professional details below.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CandidateForm />
      </div>
    </div>
  );
}
