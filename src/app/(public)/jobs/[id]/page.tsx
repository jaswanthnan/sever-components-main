import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import type { Job as JobRecord } from '@/types';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import ApplyForm from './ApplyForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ──────────────────────────────────────────────────────────────
// 📌 DYNAMIC METADATA API
// Fetches the specific job dynamically from MongoDB and populates
// the page's <title>, <meta description>, and social graph tags.
// ──────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    await dbConnect();
    const job = await Job.findById(id).lean<JobRecord>();
    if (!job) {
      return {
        title: 'Job Not Found — HireSync Careers',
      };
    }

    const title = `${job.title} (${job.department}) — Careers at HireSync`;
    const description = `Apply for the ${job.title} role in ${job.location} at HireSync. Join our world-class team.`;

    return {
      title,
      description,
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title,
        description,
        type: 'article',
        url: `/jobs/${id}`,
        // og:image is handled by our dynamic opengraph-image.tsx in the same folder!
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: 'Careers — HireSync',
    };
  }
}

async function getJobDetails(id: string) {
  await dbConnect();
  return Job.findById(id).lean<JobRecord>();
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJobDetails(id);

  if (!job) {
    notFound();
  }

  const formattedDate = job.createdAt
    ? new Date(job.createdAt as string).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sleek Modern Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white py-16 px-6 relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-indigo-200 hover:text-white font-bold text-sm mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Careers
          </Link>

          <div className="space-y-4">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">
              {job.department}
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">
                  {job.salaryRange || 'Competitive Salary'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">Posted {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Job Description and Requirements */}
        <div className="md:col-span-2 space-y-12">
          {/* Description Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-3 border-slate-200 dark:border-slate-800">
              The Role
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
              {job.description}
            </p>
          </section>

          {/* Requirements Section */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight border-b pb-3 border-slate-200 dark:border-slate-800">
                What You'll Need
              </h2>
              <ul className="grid gap-4">
                {job.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex gap-3 items-start text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column: Dynamic Form / Actions Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl shadow-indigo-950/5 space-y-6">
            <h3 className="text-xl font-bold tracking-tight">Interested in this role?</h3>
            <p className="text-slate-500 text-sm">
              Submit your application in just a few steps. Our recruiting team will review your profile within 48 hours.
            </p>

            {/* Interactive Apply Modal trigger & Client Application Form */}
            <ApplyForm jobTitle={job.title} jobLocation={job.location} />
          </div>
        </div>
      </div>
    </div>
  );
}
