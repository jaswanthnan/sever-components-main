'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (val: string) => void;
}

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'];
const TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];

export default function JobFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedDepartment,
  onDepartmentChange,
}: JobFiltersProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-300">
      <div className="relative w-full md:max-w-md">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by job title, location..."
          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Types' : type}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept === 'All' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
