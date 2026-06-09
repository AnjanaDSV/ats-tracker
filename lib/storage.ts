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

// ── Gaps ──────────────────────────────────────────────────────────────────────

const GAPS_KEY = 'track_gaps_v1';

export type GapCategory = 'tools' | 'concepts' | 'domain' | 'certs';
export type GapPriority = 'high' | 'medium' | 'low';
export type GapStatus = 'Open' | 'Learning' | 'Done';

export interface SkillGap {
  id: string;
  name: string;
  category: GapCategory;
  priority: GapPriority;
  status: GapStatus;
  howToFix: string;
  companies: string;   // comma-separated
  createdAt: string;
  updatedAt: string;
}

export type GapFormData = Omit<SkillGap, 'id' | 'createdAt' | 'updatedAt'>;

const DEFAULT_GAPS: Omit<SkillGap, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'dbt advanced (macros, Jinja, DRY)', category: 'tools', priority: 'high', status: 'Open', howToFix: 'Build dbt project with custom macros', companies: 'CrowdStrike, Lovevery' },
  { name: 'DataDog monitoring', category: 'tools', priority: 'high', status: 'Open', howToFix: 'Add to HIPAA engine free 14-day trial', companies: 'Wurl, FedEx' },
  { name: 'Medallion architecture', category: 'concepts', priority: 'high', status: 'Open', howToFix: 'Use bronze/silver/gold naming in Databricks projects', companies: 'Dow, MVB Bank' },
  { name: 'Databricks certification', category: 'certs', priority: 'high', status: 'Open', howToFix: 'July exam plan already set', companies: 'Humana, Dow, FedEx' },
  { name: 'Jenkins/GitLab CI/CD', category: 'tools', priority: 'medium', status: 'Open', howToFix: 'Add GitLab pipeline to one project', companies: 'CrowdStrike' },
  { name: 'SCD (Slowly Changing Dimensions)', category: 'concepts', priority: 'medium', status: 'Open', howToFix: 'Study dbt SCD docs', companies: 'Dow, Lovevery' },
  { name: 'Delta Live Tables', category: 'tools', priority: 'medium', status: 'Open', howToFix: 'Databricks community edition practice', companies: 'Dow' },
  { name: 'Great Expectations', category: 'tools', priority: 'medium', status: 'Open', howToFix: 'Add to HIPAA engine validation', companies: 'Dow' },
  { name: 'Semantic layer explicit', category: 'concepts', priority: 'medium', status: 'Open', howToFix: 'Add exact phrase to resume', companies: 'CrowdStrike, Lovevery' },
  { name: 'Looker/Tableau', category: 'tools', priority: 'medium', status: 'Open', howToFix: 'Looker free trial', companies: 'Lovevery, Paramount' },
  { name: 'LLM evaluation/eval harnesses', category: 'concepts', priority: 'medium', status: 'Open', howToFix: 'LangSmith free tier', companies: 'Tern, Red Hat' },
  { name: 'Revenue attribution', category: 'concepts', priority: 'medium', status: 'Open', howToFix: 'Reframe Albertsons monetization work', companies: 'CrowdStrike, Wurl' },
  { name: 'AWS Cloud Practitioner cert', category: 'certs', priority: 'medium', status: 'Open', howToFix: 'Already planned', companies: 'MVB Bank' },
  { name: 'SSIS/SSMS', category: 'tools', priority: 'medium', status: 'Open', howToFix: 'One tutorial sufficient', companies: 'Humana' },
  { name: 'Marketo/People.ai/Outreach', category: 'tools', priority: 'low', status: 'Open', howToFix: 'Read product docs only', companies: 'CrowdStrike' },
  { name: 'Dagster/Prefect', category: 'tools', priority: 'low', status: 'Open', howToFix: 'One tutorial covers basics', companies: 'Lovevery' },
  { name: 'Apache Iceberg', category: 'tools', priority: 'low', status: 'Open', howToFix: 'Read docs + one tutorial', companies: '' },
  { name: 'Neo4j/CosmosDB', category: 'tools', priority: 'low', status: 'Open', howToFix: 'Understand concepts for interviews', companies: 'Dow' },
  { name: 'Microsoft Fabric/OneLake', category: 'tools', priority: 'low', status: 'Open', howToFix: 'Free trial if targeting Microsoft shops', companies: 'Bulfinch' },
  { name: 'OTT/streaming domain', category: 'domain', priority: 'low', status: 'Open', howToFix: 'Read HLS/DASH formats basics', companies: 'Wurl, Paramount' },
];

export function getGaps(): SkillGap[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GAPS_KEY);
    if (raw) return JSON.parse(raw) as SkillGap[];
    // First visit — seed with defaults
    const now = new Date().toISOString();
    const seeded: SkillGap[] = DEFAULT_GAPS.map((g, i) => ({
      ...g,
      id: `default-gap-${i}`,
      createdAt: now,
      updatedAt: now,
    }));
    localStorage.setItem(GAPS_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return [];
  }
}

function saveGaps(gaps: SkillGap[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GAPS_KEY, JSON.stringify(gaps));
}

export function addGap(data: GapFormData): SkillGap {
  const gap: SkillGap = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const gaps = getGaps();
  gaps.unshift(gap);
  saveGaps(gaps);
  return gap;
}

export function updateGap(id: string, updates: Partial<GapFormData>): SkillGap | null {
  const gaps = getGaps();
  const idx = gaps.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  gaps[idx] = { ...gaps[idx], ...updates, updatedAt: new Date().toISOString() };
  saveGaps(gaps);
  return gaps[idx];
}

export function deleteGap(id: string): void {
  saveGaps(getGaps().filter((g) => g.id !== id));
}

// ── Clear all ─────────────────────────────────────────────────────────────────

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(JOBS_KEY);
  localStorage.removeItem(RESUME_KEY);
  localStorage.removeItem(GAPS_KEY);
}
