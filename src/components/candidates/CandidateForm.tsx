'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, Loader2, Plus, Save, X } from 'lucide-react';
import { candidateApi } from '@/lib/api/candidates';
import {
  nextCandidateFormSchema,
  type NextCandidateFormValues,
} from '@/schemas/candidateSchema';

const predefinedSkills = [
  'React',
  'Java',
  'Python',
  'CSS',
  'HTML',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Next.js',
];

const roleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'DevOps Engineer',
  'Mobile Developer',
  'UI/UX Designer',
];

const statusOptions = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'] as const;

const defaultValues: NextCandidateFormValues = {
  name: '',
  email: '',
  role: 'Frontend Developer',
  experience: 0,
  location: '',
  status: 'Applied',
  skills: ['React', 'TypeScript'],
  resumeUrl: '',
};

export default function CandidateForm() {
  const router = useRouter();
  const [customSkill, setCustomSkill] = useState('');
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<NextCandidateFormValues>({
    resolver: zodResolver(nextCandidateFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const selectedSkills = useWatch({
    control,
    name: 'skills',
  });

  const toggleSkill = (skill: string) => {
    const nextSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((item) => item !== skill)
      : [...selectedSkills, skill];

    setValue('skills', nextSkills, { shouldDirty: true, shouldValidate: true });

    if (nextSkills.length > 0) {
      clearErrors('skills');
    }
  };

  const handleAddCustomSkill = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    const trimmed = customSkill.trim();

    if (!trimmed || selectedSkills.includes(trimmed)) {
      return;
    }

    setValue('skills', [...selectedSkills, trimmed], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCustomSkill('');
    clearErrors('skills');
  };

  const onSubmit = async (values: NextCandidateFormValues) => {
    try {
      await candidateApi.create(values);
      router.push('/candidates');
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create candidate.';

      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'server', message });
      } else {
        setError('root', { type: 'server', message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.name ? <p className="text-sm text-rose-500">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="john@example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.email ? <p className="text-sm text-rose-500">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Role</label>
          <div className="relative">
            <select
              {...register('role')}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
          {errors.role ? <p className="text-sm text-rose-500">{errors.role.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Experience (Years)</label>
          <input
            {...register('experience', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.experience ? <p className="text-sm text-rose-500">{errors.experience.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
          <input
            {...register('location')}
            type="text"
            placeholder="Bengaluru"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.location ? <p className="text-sm text-rose-500">{errors.location.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Pipeline Status</label>
          <div className="relative">
            <select
              {...register('status')}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
          {errors.status ? <p className="text-sm text-rose-500">{errors.status.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Resume URL (Optional)</label>
        <input
          {...register('resumeUrl')}
          type="text"
          placeholder="https://example.com/resume.pdf"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-800/20">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Candidate Skills</label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Select skills below or type custom skills to add them.
          </span>
        </div>

        <div className="flex min-h-12 flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          {selectedSkills.length === 0 ? (
            <span className="flex items-center text-sm italic text-slate-400">
              No skills selected yet. Select from the lists below or add one.
            </span>
          ) : (
            selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/40 dark:text-indigo-400"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="rounded-full p-0.5 text-indigo-400 transition-colors hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Popular Skills
          </span>
          <div className="flex flex-wrap gap-2">
            {predefinedSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex select-none items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all active:scale-[0.97] ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : null}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-2 dark:border-slate-800/80">
          <input
            type="text"
            placeholder="Type custom skill (e.g. Docker, Go)"
            value={customSkill}
            onChange={(event) => setCustomSkill(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddCustomSkill(event);
              }
            }}
            className="max-w-xs flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={handleAddCustomSkill}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:bg-slate-800 active:scale-[0.97] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {errors.skills ? <p className="text-sm text-rose-500">{errors.skills.message}</p> : null}
      </div>

      {errors.root ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400">
          {errors.root.message}
        </div>
      ) : null}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition-all active:scale-[0.98] hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <X className="h-5 w-5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] hover:bg-indigo-700 disabled:bg-indigo-400 dark:shadow-none"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save Candidate
        </button>
      </div>
    </form>
  );
}
