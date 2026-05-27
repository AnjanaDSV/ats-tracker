export type JobStatus =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted';

export const JOB_STATUSES: JobStatus[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Ghosted',
];

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string;       // ISO date string YYYY-MM-DD
  jobDescription: string;
  status: JobStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface KeywordAnalysis {
  matchingKeywords: string[];
  missingKeywords: string[];
  matchScore: number;
  summary: string;
}

export type JobFormData = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;
