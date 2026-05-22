/**
 * 📌 sitemap.ts — Dynamic Sitemap for Google Indexing
 * 
 * WHY:
 * - Tells Google which public pages exist on your site
 * - Job pages get individual sitemap entries for SEO
 * - Only public pages are listed (admin/dashboard excluded)
 * 
 * HOW TO SEE THE OUTPUT:
 * Visit → http://localhost:3000/sitemap.xml
 * You will see all public job URLs listed with priority and changeFrequency.
 * 
 * In production, submit this URL to Google Search Console.
 */

import type { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import type { Job as JobRecord } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Connect to DB and fetch all open job IDs + dates
  await dbConnect();
  const jobs = await Job.find({ status: 'Open' }, { _id: 1, createdAt: 1 })
    .lean<Pick<JobRecord, '_id' | 'createdAt'>[]>();

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',  // Job board changes frequently
      priority: 0.9,
    },
  ];

  // Dynamic routes — one entry per open job
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${BASE_URL}/jobs/${String(job._id)}`,
    lastModified: job.createdAt ? new Date(job.createdAt as string) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...jobRoutes];
}
