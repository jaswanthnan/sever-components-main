import React from 'react';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import { notFound } from 'next/navigation';
import {
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  ChevronLeft,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Candidate as CandidateRecord } from '@/types';
import CvSummaryPanel from '@/components/candidates/CvSummaryPanel';

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const candidate = await Candidate.findById(id).lean<CandidateRecord | null>();

  if (!candidate) {
    notFound();
  }

  const candidateId = String(
    (candidate as CandidateRecord & { _id: unknown })._id
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/candidates"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Candidates
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />
        <div className="px-10 pb-10">
          <div className="relative -mt-12 flex items-end justify-between">
            <div className="flex items-end gap-6">
              <div className="h-32 w-32 rounded-[2rem] bg-white dark:bg-slate-900 p-2 shadow-xl">
                <div className="h-full w-full rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl font-bold text-indigo-600">
                  {candidate.name
                    .split(' ')
                    .map((namePart: string) => namePart[0])
                    .join('')}
                </div>
              </div>
              <div className="pb-4">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {candidate.name}
                </h1>
                <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {candidate.role}
                </p>
              </div>
            </div>
            <div className="pb-4 flex gap-3">
              <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95">
                Schedule Interview
              </button>
              <button className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-2xl font-bold transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
                Message
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Professional Summary
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  Highly motivated and results-driven {candidate.role} with{' '}
                  {candidate.experience} years of experience. Demonstrated
                  ability to deliver high-quality solutions and work effectively
                  in cross-functional teams.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!candidate.skills || candidate.skills.length === 0) && (
                    <span className="text-slate-400 italic">No skills listed</span>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Experience
                </h3>
                <div className="space-y-6">
                  <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                        {candidate.role}
                      </h4>
                      <p className="text-slate-500 font-medium">
                        Previous Company - 2021 to Present
                      </p>
                      <p className="mt-3 text-slate-600 dark:text-slate-400">
                        Led a team of developers to build and scale core product
                        features. Improved system performance by 40% through
                        architecture optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Contact Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">
                      Applied on{' '}
                      {candidate.createdAt
                        ? formatDate(candidate.createdAt)
                        : 'Unknown date'}
                    </span>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                    Attachments
                  </h4>
                  <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 group hover:border-indigo-500 transition-all">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Resume.pdf
                      </span>
                    </div>
                    <BadgeCheck className="w-5 h-5 text-emerald-500" />
                  </button>
                </div>
              </div>

              <CvSummaryPanel
                candidateId={candidateId}
                candidateName={candidate.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}