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
import { ExternalLink, Trash2, Pencil } from 'lucide-react';
import { deleteJob } from '@/lib/actions/job-actions';
import type { JobStatus } from '@/types';

// Let's define the local Job record type
export interface AdminJobRecord {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  status: JobStatus;
  salaryRange?: string;
  description?: string;
  requirements?: string[];
  createdAt: string;
}

interface JobTableProps {
  initialData: AdminJobRecord[];
}

export default function JobTable({ initialData }: JobTableProps) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const rowData = useMemo(
    () => initialData.filter((job) => !deletedIds.includes(job._id)),
    [deletedIds, initialData]
  );

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'title', 
      headerName: 'Job Title',
      flex: 2,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-3 h-full">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{params.value}</span>
        </div>
      )
    },
    { field: 'department', headerName: 'Department', flex: 1.2 },
    { field: 'location', headerName: 'Location', flex: 1.2 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        const styles: Record<JobStatus, string> = {
          Open: 'bg-emerald-50 text-emerald-600',
          Closed: 'bg-rose-50 text-rose-600',
          Draft: 'bg-slate-100 text-slate-600',
        };
        const status = params.value as JobStatus;
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-slate-50'}`}>
            {status}
          </span>
        );
      }
    },
    { field: 'salaryRange', headerName: 'Salary Range', flex: 1.2 },
    {
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <button 
            onClick={() => {
              router.push(`/jobs-admin/${params.data._id}/edit`);
            }}
            className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all cursor-pointer"
            title="Edit Job"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={async () => {
              if (confirm('Are you sure you want to delete this job posting?')) {
                await deleteJob(params.data._id);
                setDeletedIds((prev) => [...prev, params.data._id]);
              }
            }}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
            title="Delete Job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ], []);

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
        overlayNoRowsTemplate="No job postings found"
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
