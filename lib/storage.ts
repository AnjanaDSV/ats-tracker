import { JobApplication, JobFormData } from './types';

const JOBS_KEY = 'track_jobs_v1';
const RESUME_KEY = 'track_resume_v1';

// ── Jobs ──────────────────────────────────────────────────────────────────────

export function getJobs(): JobApplication[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    return raw ? (JSON.parse(raw) as JobApplication[]) : [];
  } catch {
    return [];
  }
}

function saveJobs(jobs: JobApplication[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getJob(id: string): JobApplication | null {
  return getJobs().find((j) => j.id === id) ?? null;
}

export function addJob(data: JobFormData): JobApplication {
  const job: JobApplication = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const jobs = getJobs();
  jobs.unshift(job);          // newest first
  saveJobs(jobs);
  return job;
}

export function updateJob(
  id: string,
  updates: Partial<JobFormData>,
): JobApplication | null {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  jobs[idx] = { ...jobs[idx], ...updates, updatedAt: new Date().toISOString() };
  saveJobs(jobs);
  return jobs[idx];
}

export function deleteJob(id: string): void {
  saveJobs(getJobs().filter((j) => j.id !== id));
}

// ── Resume ────────────────────────────────────────────────────────────────────

export function getResume(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(RESUME_KEY) ?? '';
}

export function saveResume(text: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RESUME_KEY, text);
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total: number;
  responseRate: number;   // %
  ghostRate: number;      // %
  interviews: number;
  offers: number;
}

export function getDashboardStats(jobs: JobApplication[]): DashboardStats {
  const total = jobs.length;
  if (total === 0) {
    return { total: 0, responseRate: 0, ghostRate: 0, interviews: 0, offers: 0 };
  }

  const responded = jobs.filter((j) =>
    ['Phone Screen', 'Interview', 'Offer', 'Rejected'].includes(j.status),
  ).length;

  const ghosted = jobs.filter((j) => j.status === 'Ghosted').length;
  const interviews = jobs.filter((j) => j.status === 'Interview').length;
  const offers = jobs.filter((j) => j.status === 'Offer').length;

  return {
    total,
    responseRate: Math.round((responded / total) * 100),
    ghostRate: Math.round((ghosted / total) * 100),
    interviews,
    offers,
  };
}

// ── Export / Import ───────────────────────────────────────────────────────────

export function exportJobsAsJSON(): void {
  if (typeof window === 'undefined') return;
  const jobs = getJobs();
  const payload = { exportedAt: new Date().toISOString(), version: 1, jobs };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `track-jobs-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
