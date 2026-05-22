/**
 * 📌 robots.ts — Search Engine Crawler Rules
 * 
 * WHY:
 * - Tells search engines what they CAN and CANNOT crawl
 * - Prevents admin/dashboard pages from appearing in Google
 * - Points crawlers to your sitemap
 * 
 * HOW TO SEE THE OUTPUT:
 * Visit → http://localhost:3000/robots.txt
 * 
 * Rules applied:
 * ✅ Allow: / (homepage)
 * ✅ Allow: /jobs (public job board)
 * ❌ Disallow: /dashboard (admin panel)
 * ❌ Disallow: /candidates (admin panel)
 * ❌ Disallow: /api (API endpoints)
 * ❌ Disallow: /login, /register (auth pages — no SEO value)
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',        // Homepage
          '/jobs',    // Public job board
          '/jobs/',   // Individual job pages
        ],
        disallow: [
          '/dashboard',   // Admin dashboard — private
          '/candidates',  // Candidate management — private
          '/api/',        // API routes — not for indexing
          '/login',       // Auth pages — no SEO value
          '/register',    // Auth pages — no SEO value
        ],
      },
    ],
    // Point Google to your sitemap
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
