'use client';

import React, { useDeferredValue, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ColDef, ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ExternalLink, Trash2 } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { candidateApi } from '@/lib/api/candidates';
import {
  candidateQueryKeys,
  fetchCandidates,
  getCandidateInitials,
} from '@/lib/candidate-queries';
import { useCandidateStore } from '@/store/candidateStore';
import type { Candidate, CandidateStatus, CandidateStatusFilter } from '@/types';

ModuleRegistry.registerModules([AllCommunityModule]);

interface CandidateTableProps {
  status: CandidateStatusFilter;
}

function filterCandidates(candidates: Candidate[], searchTerm: string) {
  if (!searchTerm.trim()) {
    return candidates;
  }

  const query = searchTerm.toLowerCase();
  return candidates.filter((candidate) => {
    return (
      candidate.name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.role.toLowerCase().includes(query) ||
      candidate.location.toLowerCase().includes(query) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  });
}

export default function CandidateTable({ status }: CandidateTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchTerm = useCandidateStore((state) => state.searchTerm);
  const selectedRows = useCandidateStore((state) => state.selectedRows);
  const toggleSelectedRow = useCandidateStore((state) => state.toggleSelectedRow);
  const setSelectedCandidateId = useCandidateStore((state) => state.setSelectedCandidateId);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const { data: candidates = [], isLoading, isError, error } = useQuery({
    queryKey: candidateQueryKeys.list(status),
    queryFn: () => fetchCandidates(status),
  });

  const deleteMutation = useMutation({
    mutationFn: (candidateId: string) => candidateApi.delete(candidateId),
    onMutate: async (candidateId) => {
      await queryClient.cancelQueries({ queryKey: candidateQueryKeys.all });

      const previousLists = queryClient.getQueriesData<Candidate[]>({
        queryKey: candidateQueryKeys.all,
      });

      previousLists.forEach(([queryKey, list]) => {
        if (!list) {
          return;
        }

        queryClient.setQueryData<Candidate[]>(
          queryKey,
          list.filter((candidate) => candidate._id !== candidateId)
        );
      });

      return { previousLists };
    },
    onError: (_error, _candidateId, context) => {
      context?.previousLists.forEach(([queryKey, list]) => {
        queryClient.setQueryData(queryKey, list);
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: candidateQueryKeys.all });
    },
  });

  const rowData = useMemo(
    () => filterCandidates(candidates, deferredSearchTerm),
    [candidates, deferredSearchTerm]
  );

  const columnDefs = useMemo<ColDef<Candidate>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Candidate',
        flex: 2,
        cellRenderer: (params: ICellRendererParams<Candidate>) => (
          <div className="flex h-full items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {getCandidateInitials(params.data?.name ?? '')}
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-900">{params.value}</div>
              <div className="truncate text-xs text-slate-500">{params.data?.email}</div>
            </div>
          </div>
        ),
      },
      { field: 'role', headerName: 'Applied Role', flex: 1.6 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        cellRenderer: (params: ICellRendererParams<Candidate>) => {
          const styles: Record<CandidateStatus, string> = {
            Applied: 'bg-blue-50 text-blue-600',
            Screening: 'bg-amber-50 text-amber-600',
            Interviewing: 'bg-purple-50 text-purple-600',
            Offered: 'bg-indigo-50 text-indigo-600',
            Rejected: 'bg-rose-50 text-rose-600',
            Hired: 'bg-emerald-50 text-emerald-600',
          };
          const currentStatus = params.value as CandidateStatus;
          return (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                styles[currentStatus] ?? 'bg-slate-50 text-slate-600'
              }`}
            >
              {currentStatus}
            </span>
          );
        },
      },
      { field: 'experience', headerName: 'Exp (Yrs)', flex: 0.8 },
      { field: 'location', headerName: 'Location', flex: 1 },
      {
        headerName: 'Actions',
        flex: 0.9,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<Candidate>) => {
          const candidateId = params.data?._id;

          return (
            <div className="flex h-full items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!candidateId) {
                    return;
                  }

                  setSelectedCandidateId(candidateId);
                  router.push(`/candidates/${candidateId}`);
                }}
                className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-indigo-600"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!candidateId) {
                    return;
                  }

                  if (confirm('Are you sure you want to delete this candidate?')) {
                    deleteMutation.mutate(candidateId);
                  }
                }}
                className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [deleteMutation, router, setSelectedCandidateId]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error instanceof Error ? error.message : 'Failed to load candidates.'}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ag-theme-alpine w-full dark:border-slate-800 dark:bg-slate-900">
      <AgGridReact<Candidate>
        theme="legacy"
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows
        loading={isLoading}
        rowSelection="multiple"
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[5, 10, 15]}
        domLayout="autoHeight"
        rowHeight={60}
        headerHeight={48}
        overlayNoRowsTemplate="No candidates found"
        onRowClicked={(event) => {
          const candidateId = event.data?._id;
          if (!candidateId) {
            return;
          }

          toggleSelectedRow(candidateId);
        }}
        isRowSelectable={(rowNode) => Boolean(rowNode.data?._id)}
        rowClassRules={{
          'ring-2 ring-indigo-200': (params) =>
            Boolean(params.data?._id && selectedRows.includes(params.data._id)),
        }}
      />
      <style jsx global>{`
        .ag-theme-alpine {
          --ag-border-color: transparent;
          --ag-header-background-color: transparent;
          --ag-header-foreground-color: #64748b;
          --ag-header-cell-hover-background-color: #f8fafc;
          --ag-row-hover-color: #f8fafc;
          --ag-selected-row-background-color: #eef2ff;
          --ag-font-size: 14px;
          --ag-font-family: inherit;
        }
        .ag-header-cell-label {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 11px;
        }
        .ag-row {
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}
