export type CandidateStatus =
  | 'Applied'
  | 'Screening'
  | 'Interviewing'
  | 'Offered'
  | 'Rejected'
  | 'Hired';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
export type JobStatus = 'Open' | 'Closed' | 'Draft';

export interface Job {
  _id: string;
  title: string;
  type: JobType;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  status: JobStatus;
  createdAt?: string | Date;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: CandidateStatus;
  experience: number;
  location: string;
  skills: string[];
  resumeUrl?: string;
  createdAt?: string | Date;
}

export type CandidateStatusFilter = CandidateStatus | 'all';

export interface CandidateListFilters {
  status?: CandidateStatusFilter;
}

export interface CandidateWriteInput {
  name: string;
  email: string;
  role: string;
  experience: number;
  location: string;
  status: CandidateStatus;
  skills: string[];
  resumeUrl?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface FormState {
  message: string | null;
  error: string | null;
}
