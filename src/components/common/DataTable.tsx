'use client';

import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectedKeys?: string[];
  onRowSelect?: (rowKey: string) => void;
  onSort?: (columnKey: string) => void;
  emptyMessage?: string;
}

function getValue<T>(row: T, key: string) {
  return (row as Record<string, unknown>)[key];
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  sortKey,
  sortDirection,
  selectedKeys = [],
  onRowSelect,
  onSort,
  emptyMessage = 'No rows found.',
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {onRowSelect ? <th className="w-12 px-4 py-3" /> : null}
            {columns.map((column) => {
              const columnKey = String(column.key);
              const isActive = sortKey === columnKey;

              return (
                <th
                  key={columnKey}
                  className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500 ${column.className ?? ''}`}
                >
                  {column.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(columnKey)}
                      className="inline-flex items-center gap-1 text-left transition-colors hover:text-indigo-600"
                    >
                      <span>{column.header}</span>
                      {isActive ? <span>{sortDirection === 'asc' ? '^' : 'v'}</span> : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0)}
                className="px-4 py-10 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row);
              const isSelected = selectedKeys.includes(key);

              return (
                <tr key={key} className={isSelected ? 'bg-indigo-50/60' : 'bg-white'}>
                  {onRowSelect ? (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onRowSelect(key)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => {
                    const columnKey = String(column.key);
                    return (
                      <td key={columnKey} className={`px-4 py-3 text-sm text-slate-700 ${column.className ?? ''}`}>
                        {column.render ? column.render(row) : String(getValue(row, columnKey) ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
