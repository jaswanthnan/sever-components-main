import type { Candidate } from '@/types';

export const candidateQueryKeys = {
  all: ['candidates'] as const,
  list: (status: string) => ['candidates', status] as const,
  detail: (id: string) => ['candidate', id] as const,
};

export function getCandidateStatusParam(status?: string | string[]) {
  return typeof status === 'string' && status.length > 0 ? status : 'all';
}

export function getCandidateInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}

export async function fetchCandidates(status: string) {
  const searchParams = new URLSearchParams();

  if (status !== 'all') {
    searchParams.set('status', status);
  }

  const suffix = searchParams.size > 0 ? `?${searchParams.toString()}` : '';
  const response = await fetch(`/api/candidates${suffix}`);

  if (!response.ok) {
    throw new Error('Failed to fetch candidates');
  }

  return (await response.json()) as Candidate[];
}

export async function fetchCandidateById(id: string) {
  const response = await fetch(`/api/candidates/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch candidate details');
  }

  return (await response.json()) as Candidate;
}
