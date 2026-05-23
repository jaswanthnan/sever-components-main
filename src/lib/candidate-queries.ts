import { candidateApi } from '@/lib/api/candidates';
import type { CandidateStatusFilter } from '@/types';

export const candidateQueryKeys = {
  all: ['candidates'] as const,
  list: (status: CandidateStatusFilter) => ['candidates', status] as const,
  detail: (id: string) => ['candidate', id] as const,
};

export function getCandidateStatusParam(status?: string | string[]): CandidateStatusFilter {
  if (
    typeof status === 'string' &&
    ['Applied', 'Screening', 'Interviewing', 'Offered', 'Rejected', 'Hired'].includes(status)
  ) {
    return status as CandidateStatusFilter;
  }

  return 'all';
}

export function getCandidateInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}

export async function fetchCandidates(status: CandidateStatusFilter) {
  return candidateApi.list({ status });
}

export async function fetchCandidateById(id: string) {
  return candidateApi.detail(id);
}
