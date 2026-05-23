import type {
  Candidate,
  CandidateListFilters,
  CandidateStatus,
  CandidateWriteInput,
} from '@/types';

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

async function request<TResponse, TBody = undefined>(
  input: string,
  init?: Omit<RequestInit, 'body'> & { body?: TBody }
) {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    throw new Error(payload?.error || payload?.message || 'Request failed');
  }

  return (await response.json()) as TResponse;
}

function buildCandidateListUrl(filters: CandidateListFilters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.status && filters.status !== 'all') {
    searchParams.set('status', filters.status);
  }

  const query = searchParams.toString();
  return query ? `/api/candidates?${query}` : '/api/candidates';
}

export const candidateApi = {
  list: (filters: CandidateListFilters = {}) =>
    request<Candidate[]>(buildCandidateListUrl(filters), { cache: 'no-store' }),

  detail: (id: string) =>
    request<Candidate>(`/api/candidates/${id}`, { cache: 'no-store' }),

  create: (input: CandidateWriteInput) =>
    request<Candidate, CandidateWriteInput>('/api/candidates', {
      method: 'POST',
      body: input,
    }),

  update: (id: string, input: Partial<CandidateWriteInput>) =>
    request<Candidate, Partial<CandidateWriteInput>>(`/api/candidates/${id}`, {
      method: 'PATCH',
      body: input,
    }),

  updateStatus: (id: string, status: CandidateStatus) =>
    request<Candidate, Pick<CandidateWriteInput, 'status'>>(`/api/candidates/${id}`, {
      method: 'PATCH',
      body: { status },
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/candidates/${id}`, {
      method: 'DELETE',
    }),
};
