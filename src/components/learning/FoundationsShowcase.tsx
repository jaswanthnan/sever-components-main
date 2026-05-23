'use client';

import React, { useMemo, useRef, useState } from 'react';
import DataTable, { type DataTableColumn } from '@/components/common/DataTable';
import { FilterPanel } from '@/components/patterns/FilterPanel';
import { Tab, TabsClone } from '@/components/patterns/TabsClone';
import { Tabs } from '@/components/patterns/TabsContext';
import { useDebounce, useIntersectionObserver, useLocalStorage } from '@/hooks';

type ShowcaseRow = {
  id: string;
  concept: string;
  output: string;
  note: string;
};

const rows: ShowcaseRow[] = [
  {
    id: 'typed-table',
    concept: 'Generic DataTable<T>',
    output: 'Typed columns, row keys, and selection state',
    note: 'Day 1',
  },
  {
    id: 'hooks-library',
    concept: 'Reusable hooks',
    output: 'Debounced search, local storage state, viewport observer',
    note: 'Day 2',
  },
  {
    id: 'composition',
    concept: 'Compound components',
    output: 'FilterPanel plus two Tabs implementations',
    note: 'Day 3',
  },
];

const columns: DataTableColumn<ShowcaseRow>[] = [
  { key: 'concept', header: 'Concept', sortable: true },
  { key: 'output', header: 'Visible Output' },
  { key: 'note', header: 'Day', sortable: true, className: 'w-24' },
];

export default function FoundationsShowcase() {
  const [sortKey, setSortKey] = useState<'concept' | 'note'>('concept');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['typed-table']);
  const [searchInput, setSearchInput] = useState('');
  const [savedName, setSavedName] = useLocalStorage('learning-lab-name', 'Jashwanth');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    level: ['Beginner'],
  });
  const observerRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);
  const isVisible = useIntersectionObserver(observerRef, { threshold: 0.4 });

  const filteredRows = useMemo(() => {
    const orderedRows = [...rows].sort((left, right) => {
      const leftValue = String(left[sortKey]);
      const rightValue = String(right[sortKey]);
      const result = leftValue.localeCompare(rightValue);

      return sortDirection === 'asc' ? result : -result;
    });

    if (!debouncedSearch.trim()) {
      return orderedRows;
    }

    const query = debouncedSearch.toLowerCase();
    return orderedRows.filter((row) => {
      return (
        row.concept.toLowerCase().includes(query) ||
        row.output.toLowerCase().includes(query) ||
        row.note.toLowerCase().includes(query)
      );
    });
  }, [debouncedSearch, sortDirection, sortKey]);

  const toggleRow = (rowKey: string) => {
    setSelectedKeys((current) =>
      current.includes(rowKey) ? current.filter((key) => key !== rowKey) : [...current, rowKey]
    );
  };

  const toggleSort = (columnKey: string) => {
    const nextKey = columnKey as 'concept' | 'note';

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(nextKey);
    setSortDirection('asc');
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Day 1 and Day 2</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Typed table and hooks output</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          Type into the search box to see the debounced filter, toggle rows to see typed selection, and save
          a draft learner name to local storage.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Debounced Search
              </label>
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search concepts"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-2 text-xs text-slate-500">
                Live input: <span className="font-semibold">{searchInput || 'empty'}</span> | Debounced:{' '}
                <span className="font-semibold">{debouncedSearch || 'empty'}</span>
              </p>
            </div>

            <DataTable
              columns={columns}
              rows={filteredRows}
              rowKey={(row) => row.id}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={toggleSort}
              selectedKeys={selectedKeys}
              onRowSelect={toggleRow}
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                useLocalStorage Demo
              </label>
              <input
                value={savedName}
                onChange={(event) => setSavedName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-2 text-xs text-slate-500">
                Refresh the page and this value stays because it is stored in browser local storage.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                useIntersectionObserver Demo
              </label>
              <div className="mt-3 h-24 overflow-y-auto rounded-xl border border-dashed border-slate-300 bg-white p-3">
                <div className="h-20" />
                <div
                  ref={observerRef}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isVisible ? 'Observed card is visible' : 'Scroll a little to reveal the observed card'}
                </div>
                <div className="h-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Day 3</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Compound FilterPanel</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            This is the controlled compound component version. Click chips to update shared filter state.
          </p>

          <div className="mt-6">
            <FilterPanel value={activeFilters} onChange={setActiveFilters}>
              <FilterPanel.Group name="level" title="Experience">
                <FilterPanel.Item group="level" value="Beginner">
                  Beginner
                </FilterPanel.Item>
                <FilterPanel.Item group="level" value="Intermediate">
                  Intermediate
                </FilterPanel.Item>
                <FilterPanel.Item group="level" value="Advanced">
                  Advanced
                </FilterPanel.Item>
              </FilterPanel.Group>

              <FilterPanel.Group name="track" title="Track">
                <FilterPanel.Item group="track" value="React">
                  React
                </FilterPanel.Item>
                <FilterPanel.Item group="track" value="Next.js">
                  Next.js
                </FilterPanel.Item>
                <FilterPanel.Item group="track" value="AI">
                  AI
                </FilterPanel.Item>
              </FilterPanel.Group>
            </FilterPanel>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Active filters: {JSON.stringify(activeFilters)}
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Day 3</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Tabs patterns</h2>
          </div>

          <Tabs defaultValue="context">
            <Tabs.List>
              <Tabs.Trigger id="context">Context Tabs</Tabs.Trigger>
              <Tabs.Trigger id="notes">Notes</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content id="context">
              Context-based tabs share state without prop drilling and fit the App Router client boundary well.
            </Tabs.Content>
            <Tabs.Content id="notes">
              Use this version when you want deeply nested tab parts to coordinate through context.
            </Tabs.Content>
          </Tabs>

          <TabsClone>
            <Tab label="cloneElement">
              This version uses React.Children and cloneElement to pass active state into tab items.
            </Tab>
            <Tab label="compare">
              It is useful for learning composition tradeoffs before moving to a context-driven pattern.
            </Tab>
          </TabsClone>
        </div>
      </section>
    </div>
  );
}
