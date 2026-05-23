'use client';

import Link from 'next/link';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';

type LearningDay = {
  id: string;
  day: string;
  focus: string;
  deliverable: string;
  route: string;
  implementation: string;
};

const days: LearningDay[] = [
  {
    id: 'day-1',
    day: 'Day 1',
    focus: 'TypeScript, typed API client, generic DataTable',
    deliverable: 'Typed component library + API client',
    route: '/learning-lab/foundations',
    implementation: 'src/components/common/DataTable.tsx, src/lib/api/candidates.ts, src/types/index.ts',
  },
  {
    id: 'day-2',
    day: 'Day 2',
    focus: 'Custom hooks and reusable patterns',
    deliverable: 'Reusable hooks library',
    route: '/learning-lab/foundations',
    implementation: 'src/hooks/index.ts, src/components/common/AgGridTable.tsx',
  },
  {
    id: 'day-3',
    day: 'Day 3',
    focus: 'Composition patterns, tabs, filter panel',
    deliverable: 'Compound FilterPanel component',
    route: '/learning-lab/foundations',
    implementation: 'src/components/patterns/FilterPanel.tsx, src/components/patterns/TabsContext.tsx, src/components/patterns/TabsClone.tsx',
  },
  {
    id: 'day-4',
    day: 'Day 4',
    focus: 'Zustand store, selectors, persisted filters',
    deliverable: 'Zustand-backed candidate store',
    route: '/candidates',
    implementation: 'src/store/candidateStore.ts, src/components/candidates/CandidateFilters.tsx',
  },
  {
    id: 'day-5',
    day: 'Day 5',
    focus: 'React Hook Form + Zod + typed add candidate flow',
    deliverable: 'Typed Add Candidate form',
    route: '/candidates/new',
    implementation: 'src/components/candidates/CandidateForm.tsx, src/schemas/candidateSchema.ts',
  },
  {
    id: 'day-6',
    day: 'Day 6',
    focus: 'App Router shell, layouts, route groups, modal routes',
    deliverable: 'Next.js app shell with routing',
    route: '/dashboard',
    implementation: 'src/app/(admin), src/app/(public), src/app/loading.tsx, src/app/error.tsx',
  },
  {
    id: 'day-7',
    day: 'Day 7',
    focus: 'Server vs client components, MongoDB in async server pages',
    deliverable: 'Hybrid server/client candidate page',
    route: '/candidates',
    implementation: 'src/app/(admin)/candidates/page.tsx, src/components/candidates/CandidateTable.tsx',
  },
  {
    id: 'day-8',
    day: 'Day 8',
    focus: 'Server actions, CRUD mutations, revalidation',
    deliverable: 'Server Actions for Candidate CRUD',
    route: '/candidates/new',
    implementation: 'src/lib/actions/candidate-actions.ts',
  },
  {
    id: 'day-9',
    day: 'Day 9',
    focus: 'ISR, dynamic rendering, public vs private rendering',
    deliverable: 'Job Board (ISR) + Dashboard (dynamic)',
    route: '/jobs',
    implementation: 'src/app/(public)/jobs/page.tsx, src/app/(admin)/dashboard/page.tsx',
  },
  {
    id: 'day-10',
    day: 'Day 10',
    focus: 'Streaming, Suspense, loading UI, progressive search',
    deliverable: 'Streaming search results page',
    route: '/search',
    implementation: 'src/app/(admin)/search/page.tsx, SearchSkeleton.tsx, SearchResults.tsx',
  },
  {
    id: 'day-11',
    day: 'Day 11',
    focus: 'Route handlers, middleware, matcher patterns, Auth.js',
    deliverable: 'Authenticated app + protected routes',
    route: '/dashboard',
    implementation: 'src/app/api/*, src/proxy.ts, src/auth.ts',
  },
  {
    id: 'day-12',
    day: 'Day 12',
    focus: 'TanStack Query hydration, optimistic mutations, AI SDK',
    deliverable: 'AI-assisted Candidate Detail page',
    route: '/candidates',
    implementation: 'src/lib/react-query.ts, src/lib/candidate-queries.ts, src/components/candidates/CvSummaryPanel.tsx',
  },
  {
    id: 'day-13',
    day: 'Day 13',
    focus: 'Metadata API, next/image, dynamic OG image, SEO',
    deliverable: 'Optimized Job Board',
    route: '/jobs',
    implementation: 'src/app/(public)/jobs/page.tsx, src/app/(public)/jobs/[id]/page.tsx, opengraph-image.tsx',
  },
  {
    id: 'day-14',
    day: 'Day 14',
    focus: 'Tests, observability, Sentry, deployment readiness',
    deliverable: 'Tested + observable Next.js app',
    route: '/sentry-test',
    implementation: 'src/app/sentry-example-page/page.tsx, src/app/(admin)/sentry-test/page.tsx, src/app/api/sentry-error/route.ts',
  },
];

const columns: DataTableColumn<LearningDay>[] = [
  { key: 'day', header: 'Day', sortable: true },
  { key: 'focus', header: 'Focus', sortable: true },
  { key: 'deliverable', header: 'Deliverable' },
  {
    key: 'route',
    header: 'Output Route',
    render: (row) => (
      <Link href={row.route} className="font-semibold text-indigo-600 hover:text-indigo-700">
        {row.route}
      </Link>
    ),
  },
];

export default function LearningLabPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Implementation Map</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Next.js Learning Lab
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          This page maps the day-by-day plan into the same <code>Server-Components-main</code> project.
          Use the table below to open the live output routes, then use the implementation notes to find the
          exact files where each topic was wired.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={days}
        rowKey={(row) => row.id}
        emptyMessage="No implementation rows found."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {days.map((day) => (
          <div
            key={day.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{day.day}</p>
                <h2 className="mt-2 text-lg font-black text-slate-900 dark:text-white">{day.focus}</h2>
              </div>
              <Link
                href={day.route}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100"
              >
                Open Output
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              {day.deliverable}
            </p>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              <span className="font-bold uppercase tracking-[0.2em] text-slate-400">Implemented In</span>
              <br />
              {day.implementation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
