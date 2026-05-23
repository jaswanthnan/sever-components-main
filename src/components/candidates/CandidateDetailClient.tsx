'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  ChevronLeft,
  FileText,
  Mail,
  MapPin,
  Trash2,
} from 'lucide-react';
import { candidateApi } from '@/lib/api/candidates';
import { candidateQueryKeys, fetchCandidateById, getCandidateInitials } from '@/lib/candidate-queries';
import { formatDate } from '@/lib/utils';
import { useCandidateStore } from '@/store/candidateStore';
import type { Candidate, CandidateStatus } from '@/types';
import CvSummaryPanel from '@/components/candidates/CvSummaryPanel';

const pipelineStatuses: CandidateStatus[] = [
  'Applied',
  'Screening',
  'Interviewing',
  'Offered',
  'Hired',
  'Rejected',
];

interface CandidateDetailClientProps {
  candidateId: string;
}

export default function CandidateDetailClient({ candidateId }: CandidateDetailClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSelectedCandidateId = useCandidateStore((state) => state.setSelectedCandidateId);

  const { data: candidate, isLoading, error } = useQuery({
    queryKey: candidateQueryKeys.detail(candidateId),
    queryFn: () => fetchCandidateById(candidateId),
  });

  useEffect(() => {
    setSelectedCandidateId(candidateId);
  }, [candidateId, setSelectedCandidateId]);

  const statusMutation = useMutation({
    mutationFn: (status: CandidateStatus) => candidateApi.updateStatus(candidateId, status),
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: candidateQueryKeys.detail(candidateId) });
      const previousCandidate = queryClient.getQueryData<Candidate>(candidateQueryKeys.detail(candidateId));

      if (previousCandidate) {
        queryClient.setQueryData<Candidate>(candidateQueryKeys.detail(candidateId), {
          ...previousCandidate,
          status,
        });
      }

      return { previousCandidate };
    },
    onError: (_error, _status, context) => {
      if (context?.previousCandidate) {
        queryClient.setQueryData(candidateQueryKeys.detail(candidateId), context.previousCandidate);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: candidateQueryKeys.detail(candidateId) });
      void queryClient.invalidateQueries({ queryKey: candidateQueryKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => candidateApi.delete(candidateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: candidateQueryKeys.all });
      router.push('/candidates');
      router.refresh();
    },
  });

  if (isLoading || !candidate) {
    return (
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-52 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-72 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-[2rem] bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error instanceof Error ? error.message : 'Failed to load candidate details.'}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/candidates"
        className="inline-flex items-center gap-2 font-medium text-slate-500 transition-colors hover:text-indigo-600"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Candidates
      </Link>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />
        <div className="px-10 pb-10">
          <div className="relative -mt-12 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex items-end gap-6">
              <div className="h-32 w-32 rounded-[2rem] bg-white p-2 shadow-xl dark:bg-slate-900">
                <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-slate-100 text-4xl font-bold text-indigo-600 dark:bg-slate-800">
                  {getCandidateInitials(candidate.name)}
                </div>
              </div>
              <div className="pb-4">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {candidate.name}
                </h1>
                <p className="mt-1 flex items-center gap-2 font-medium text-slate-500">
                  <Briefcase className="h-4 w-4" />
                  {candidate.role}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pb-4">
              <button
                type="button"
                onClick={() => router.push('/candidates')}
                className="rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
              >
                View Pipeline
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (confirm('Delete this candidate?')) {
                    deleteMutation.mutate();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-6 py-3 font-bold text-rose-600 transition-all hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400"
              >
                <Trash2 className="h-4 w-4" />
                Delete Candidate
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/20">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Pipeline</p>
                <p className="text-sm text-slate-500">Optimistic updates via TanStack Query mutation.</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-600 shadow-sm dark:bg-slate-900">
                {candidate.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {pipelineStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => statusMutation.mutate(status)}
                  disabled={statusMutation.isPending}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    candidate.status === status
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <section>
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                  Professional Summary
                </h3>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Highly motivated and results-driven {candidate.role} with {candidate.experience} years
                  of experience. Demonstrated ability to deliver high-quality solutions and work effectively
                  in cross-functional teams.
                </p>
              </section>

              <section>
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Experience</h3>
                <div className="space-y-6">
                  <div className="flex gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{candidate.role}</h4>
                      <p className="font-medium text-slate-500">Previous Company | 2021 - Present</p>
                      <p className="mt-3 text-slate-600 dark:text-slate-400">
                        Led a team of contributors, shipped core features, and improved delivery quality with
                        clearer technical ownership and cross-functional collaboration.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div className="space-y-6 rounded-[2rem] border border-slate-100 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Info</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Mail className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">
                      Applied on {candidate.createdAt ? formatDate(candidate.createdAt) : 'Unknown date'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                  <h4 className="mb-4 font-bold text-slate-900 dark:text-white">Attachments</h4>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-500 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Resume.pdf</span>
                    </div>
                    <BadgeCheck className="h-5 w-5 text-emerald-500" />
                  </button>
                </div>
              </div>

              <CvSummaryPanel candidateId={candidateId} candidateName={candidate.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
