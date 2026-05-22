'use client';

import React, { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createCandidate } from '@/lib/actions/candidate-actions';
import { Loader2, Save, X, Check, Plus, ChevronDown } from 'lucide-react';
import type { FormState } from '@/types';

const initialState: FormState = {
  message: null,
  error: null,
};

function SubmitButton() {
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
          Save Candidate
        </>
      )}
    </button>
  );
}

export default function CandidateForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createCandidate, initialState);

  // Skills state
  const predefinedSkills = ['React', 'Java', 'Python', 'CSS', 'HTML', 'JavaScript', 'TypeScript', 'Node.js', 'Next.js'];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'CSS', 'HTML']);
  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setCustomSkill('');
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden inputs to send selected skills natively through form data */}
      {selectedSkills.map((skill) => (
        <input key={skill} type="hidden" name="skills" value={skill} />
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
          <input
            required
            name="name"
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
          <input
            required
            name="email"
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Role</label>
          <div className="relative">
            <select
              required
              name="role"
              defaultValue=""
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 focus:outline-none appearance-none cursor-pointer font-medium text-left"
            >
              <option value="" disabled>Select Job Role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Fullstack Developer">Fullstack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 dark:text-slate-500">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Experience (Years)</label>
          <input
            required
            name="experience"
            type="number"
            min="0"
            placeholder="0"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
        <input
          required
          name="location"
          type="text"
          placeholder="New York, NY"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Modern Interactive Skills Multi-select Section */}
      <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Candidate Skills</label>
          <span className="text-xs text-slate-500 dark:text-slate-400">Select skills below or type custom skills to add them.</span>
        </div>

        {/* Selected Skills Badges Area */}
        <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {selectedSkills.length === 0 ? (
            <span className="text-sm text-slate-400 italic flex items-center">No skills selected yet. Select from the lists below or add one.</span>
          ) : (
            selectedSkills.map(skill => (
              <span 
                key={skill} 
                className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-900/30 animate-in fade-in zoom-in duration-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="hover:bg-indigo-100 dark:hover:bg-indigo-900/80 rounded-full p-0.5 transition-colors cursor-pointer text-indigo-400 hover:text-indigo-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Popular/Predefined Skills Options */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Popular Skills</span>
          <div className="flex flex-wrap gap-2">
            {predefinedSkills.map(skill => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none active:scale-[0.97] duration-150 ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Skill Creator Field */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type custom skill (e.g. Docker, Go)"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill(e)}
            className="flex-1 max-w-xs px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={handleAddCustomSkill}
            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3.5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
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
        <SubmitButton />
      </div>
    </form>
  );
}
