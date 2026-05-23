import FoundationsShowcase from '@/components/learning/FoundationsShowcase';

export default function FoundationsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Foundations Output</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Day 1 to Day 3 Showcase</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          This page lets you see the typed table, reusable hooks, and compound component patterns directly in
          the same Next.js app.
        </p>
      </div>

      <FoundationsShowcase />
    </div>
  );
}
