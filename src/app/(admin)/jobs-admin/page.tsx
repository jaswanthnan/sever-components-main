'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Briefcase } from 'lucide-react';
import JobFilters from '../../../components/jobs/JobFilters';
import JobTable from '../../../components/jobs/JobTable';
import type { Job } from '@/types';

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete job');
      
      // Update local state
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Client-side filtering logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;

    return matchesSearch && matchesType && matchesDepartment;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage Job Postings
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-sm font-medium">
            Create, modify, and manage career opportunities displayed on the public careers portal.
          </p>
        </div>

        <Link
          href="/jobs-admin/new"
          className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-50 text-white dark:text-slate-950 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Filters Component */}
      <JobFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
      />

      {/* Main Table / Loader State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading job postings...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 rounded-[2.5rem]">
          <p className="font-bold text-lg">Error Loading Jobs</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <JobTable jobs={filteredJobs} onDelete={handleDeleteJob} />
      )}
    </div>
  );
}
