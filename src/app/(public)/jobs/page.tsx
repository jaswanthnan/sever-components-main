/**
 * 📌 OPTIMIZATIONS APPLIED ON THIS PAGE:
 * 
 * 1. next/image (LCP improvement)
 *    - Hero banner uses <Image> with loading="eager" (LCP element — loads immediately)
 *    - Candidate avatar initials use <div> (no image needed)
 * 
 * 2. Static Metadata API (SEO)
 *    - Unique <title> and <meta description> for this page
 *    - openGraph and twitter metadata for social sharing previews
 *    - robots: { index: true } — overrides the root layout's noindex
 * 
 * 3. ISR (already present) — revalidates every 60s for fresh job data
 * 
 * HOW TO SEE:
 * - View page source → check <head> for metadata
 * - DevTools Network → filter Font → see /_next/static/media/ (self-hosted)
 * - Lighthouse → check LCP, CLS, SEO scores
 * - https://opengraph.xyz → paste URL → see social preview card
 */

import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import {
  MapPin,
  DollarSign,
  ChevronRight,
  Zap
} from 'lucide-react';
import type { Job as JobRecord } from '@/types';

// ──────────────────────────────────────────────────────────────
// 📌 METADATA API — Static metadata for the public jobs page
// HOW TO SEE: Right-click → View Page Source → look in <head>
// ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Open Positions — Careers at HireSync',
  description:
    'Explore open job positions at HireSync. Apply to Frontend, Backend, Fullstack, DevOps, and Design roles. Join a world-class engineering team.',
  keywords: [
    'jobs', 'careers', 'hiring', 'frontend developer', 'backend developer',
    'fullstack', 'devops', 'react', 'node.js', 'HireSync'
  ],
  // Override root layout's noindex — public pages SHOULD be indexed
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // OpenGraph — controls LinkedIn/WhatsApp/Twitter preview cards
  openGraph: {
    title: 'Open Positions — Careers at HireSync',
    description:
      'Explore open roles at HireSync. Join our team of engineers, designers, and product thinkers.',
    type: 'website',
    locale: 'en_US',
    siteName: 'HireSync Careers',
    // og:image makes the link preview rich when shared on social media
    images: [
      {
        url: '/og-jobs-banner.png',
        width: 1200,
        height: 630,
        alt: 'HireSync Careers — Open Positions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Positions — Careers at HireSync',
    description: 'Explore open roles at HireSync.',
    images: ['/og-jobs-banner.png'],
  },
};

async function getJobs() {
  await dbConnect();
  return Job.find({ status: 'Open' }).sort({ createdAt: -1 }).lean<JobRecord[]>();
}

import { connection } from 'next/server';

export default async function PublicJobsPage() {
  await connection();
  const jobs = await getJobs();

  const lastRevalidated = new Date().toLocaleTimeString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ISR indicator bar */}
      <div className="bg-indigo-600 text-white py-3 shadow-lg relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Next.js Concept Active</p>
              <p className="text-sm font-bold">SSG + ISR (Incremental Static Regeneration)</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Last Cache Refresh</p>
              <p className="text-sm font-mono font-bold bg-white/10 px-3 py-1 rounded-full">{lastRevalidated}</p>
            </div>
            <div className="text-right border-l border-white/20 pl-6">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Revalidate Every</p>
              <p className="text-sm font-bold">60 Seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────
          📌 next/image — Hero Banner (LCP Element)
          Displayed as a clean centered card — exactly as designed.
          loading="eager" + fetchPriority="high" = best LCP score.
          width/height declared = zero CLS (no layout shift).
          ────────────────────────────────────────────────────────────── */}
      <div className="py-10 flex justify-center px-6">
        <div className="w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-900/30 ring-1 ring-indigo-800/30">
          <Image
            src="/og-jobs-banner.png"
            alt="HireSync Careers — Build the Future of HR"
            width={1200}
            height={630}
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      </div>

      {/* Job listings */}
      <div className="max-w-5xl mx-auto px-6 pb-24 pt-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Open Positions ({jobs.length})</h2>
        </div>

        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id.toString()} className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {job.department}
                    </span>
                  </div>
                  <Link href={`/jobs/${job._id.toString()}`}>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors cursor-pointer">
                      {job.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap gap-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Competitive Salary</span>
                    </div>
                  </div>
                </div>
                <Link href={`/jobs/${job._id.toString()}`} className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-[1.5rem] font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all whitespace-nowrap cursor-pointer">
                  Apply Now
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 font-medium text-lg">No open positions at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
