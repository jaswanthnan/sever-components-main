'use client';

import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  ICellRendererParams,
  ModuleRegistry
} from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);
import { useRouter } from 'next/navigation';
import { ExternalLink, Trash2 } from 'lucide-react';
import { deleteCandidate } from '@/lib/actions/candidate-actions';
import type { Candidate, CandidateStatus } from '@/types';

interface CandidateTableProps {
  initialData: Candidate[];
}

export default function CandidateTable({ initialData }: CandidateTableProps) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const rowData = useMemo(
    () => initialData.filter((candidate) => !deletedIds.includes(candidate._id)),
    [deletedIds, initialData]
  );

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'name', 
      headerName: 'Candidate',
      flex: 2,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full">
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            {params.data.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <span className="font-semibold text-slate-900">{params.value}</span>
        </div>
      )
    },
    { field: 'role', headerName: 'Applied Role', flex: 1.5 },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        const styles: Record<CandidateStatus, string> = {
          Applied: 'bg-blue-50 text-blue-600',
          Screening: 'bg-amber-50 text-amber-600',
          Interviewing: 'bg-purple-50 text-purple-600',
          Offered: 'bg-indigo-50 text-indigo-600',
          Rejected: 'bg-rose-50 text-rose-600',
          Hired: 'bg-emerald-50 text-emerald-600',
        };
        const status = params.value as CandidateStatus;
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-slate-50'}`}>
            {status}
          </span>
        );
      }
    },
    { field: 'experience', headerName: 'Exp (Yrs)', flex: 0.8 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <button 
            onClick={() => router.push(`/candidates/${params.data._id}`)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button 
            onClick={async () => {
              if (confirm('Are you sure you want to delete this candidate?')) {
                await deleteCandidate(params.data._id);
                setDeletedIds((prev) => [...prev, params.data._id]);
              }
            }}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ], [router]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm ag-theme-alpine w-full">
      <AgGridReact
        theme="legacy"
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[5, 10, 15]}
        domLayout="autoHeight"
        overlayNoRowsTemplate="No candidates found"
      />
      <style jsx global>{`
        .ag-theme-alpine {
          --ag-border-color: transparent;
          --ag-header-background-color: transparent;
          --ag-header-foreground-color: #64748b;
          --ag-header-cell-hover-background-color: #f8fafc;
          --ag-row-hover-color: #f8fafc;
          --ag-selected-row-background-color: #f1f5f9;
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
