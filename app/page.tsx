'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, getDashboardStats, clearAllData, DashboardStats } from '@/lib/storage';
import { JobApplication } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import {
  Briefcase,
  TrendingUp,
  Ghost,
  CalendarCheck,
  Trophy,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Trash2,
  AlertTriangle,
  Target,
} from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

function StatCard({ icon, label, value, sub, accent = 'bg-cream-100' }: StatCardProps) {
  return (
    <div className={`rounded-2xl p-5 border border-cream-300 shadow-card ${accent}`}>
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-white/60 text-bark-500">{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-bark-800 leading-none">{value}</p>
        <p className="text-sm font-medium text-bark-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-bark-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    responseRate: 0,
    ghostRate: 0,
    interviews: 0,
    offers: 0,
    skillGap: 0,
  });
  const [clearStep, setClearStep] = useState<'idle' | 'confirm'>('idle');

  useEffect(() => {
    const all = getJobs();
    setJobs(all);
    setStats(getDashboardStats(all));
  }, []);

  function handleClearAll() {
    clearAllData();
    setJobs([]);
    setStats({ total: 0, responseRate: 0, ghostRate: 0, interviews: 0, offers: 0, skillGap: 0 });
    setClearStep('idle');
  }

  const recent = jobs.slice(0, 5);

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-bark-800">Dashboard</h2>
        <p className="text-bark-400 mt-1 text-sm">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard
          icon={<Briefcase className="w-5 h-5" />}
          label="Total Applied"
          value={stats.total}
          sub="all time"
          accent="bg-cream-100"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Response Rate"
          value={`${stats.responseRate}%`}
          sub="of applications"
          accent="bg-sky-50"
        />
        <StatCard
          icon={<Ghost className="w-5 h-5" />}
          label="Ghost Rate"
          value={`${stats.ghostRate}%`}
          sub="no reply"
          accent="bg-stone-50"
        />
        <StatCard
          icon={<CalendarCheck className="w-5 h-5" />}
          label="Interviews"
          value={stats.interviews}
          sub="scheduled / in progress"
          accent="bg-amber-50"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Skill Gap Roles"
          value={stats.skillGap}
          sub="building toward"
          accent="bg-orange-50"
        />
      </div>

      {/* Offers banner */}
      {stats.offers > 0 && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 flex items-center gap-4">
          <Trophy className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-800">
              🎉 You have {stats.offers} active offer{stats.offers > 1 ? 's' : ''}!
            </p>
            <p className="text-sm text-emerald-600">Congratulations — keep going!</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {jobs.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-cream-300 bg-cream-100 px-8 py-14 text-center">
          <Briefcase className="w-10 h-10 text-bark-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-bark-700 mb-2">
            No applications yet
          </h3>
          <p className="text-bark-400 text-sm mb-6 max-w-xs mx-auto">
            Start tracking your job search by adding your first application.
          </p>
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add Your First Job
          </Link>
        </div>
      )}

      {/* Recent applications */}
      {jobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-bark-800">Recent Applications</h3>
            <Link
              href="/jobs"
              className="text-sm text-bark-500 hover:text-bark-700 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recent.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center justify-between bg-cream-100 border border-cream-300 rounded-2xl px-5 py-4 hover:shadow-card-hover hover:border-bark-300 transition-all duration-150 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-bark-100 border border-bark-200 flex items-center justify-center shrink-0">
                    <span className="text-bark-600 font-bold text-sm">
                      {job.company.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-bark-800 truncate">{job.company}</p>
                    <p className="text-sm text-bark-500 truncate">{job.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <StatusBadge status={job.status} size="sm" />
                  <p className="text-xs text-bark-400 hidden sm:block">
                    {new Date(job.dateApplied).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <ArrowRight className="w-4 h-4 text-bark-300 group-hover:text-bark-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/jobs/new"
          className="flex items-center gap-3 px-5 py-4 bg-bark-600 text-cream-50 rounded-2xl hover:bg-bark-700 transition-colors shadow-sm font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Add Application</p>
            <p className="text-xs text-cream-300 mt-0.5">Log a new job application</p>
          </div>
        </Link>
        <Link
          href="/keywords"
          className="flex items-center gap-3 px-5 py-4 bg-cream-100 border border-cream-300 text-bark-700 rounded-2xl hover:shadow-card-hover hover:border-bark-300 transition-all font-medium"
        >
          <Sparkles className="w-5 h-5 text-bark-500" />
          <div>
            <p className="font-semibold">AI Keyword Match</p>
            <p className="text-xs text-bark-400 mt-0.5">Compare resume to job description</p>
          </div>
        </Link>
      </div>

      {/* ── Danger Zone ───────────────────────────────────────────────────────── */}
      <div className="mt-14 border-t border-cream-300 pt-8">
        <h3 className="text-sm font-semibold text-bark-400 uppercase tracking-widest mb-4">
          Danger Zone
        </h3>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
          {clearStep === 'idle' ? (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-bark-700">Clear All Data</p>
                <p className="text-xs text-bark-400 mt-0.5">
                  Permanently delete all {jobs.length > 0 ? `${jobs.length} application${jobs.length !== 1 ? 's' : ''} and your` : 'applications and'} saved resume. Use this to start fresh.
                </p>
              </div>
              <button
                onClick={() => setClearStep('confirm')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-rose-700">Are you absolutely sure?</p>
                  <p className="text-xs text-rose-600 mt-0.5">
                    This will permanently delete{' '}
                    <span className="font-bold">
                      {jobs.length} application{jobs.length !== 1 ? 's' : ''}
                    </span>{' '}
                    and your saved resume. This cannot be undone.
                    {jobs.length > 0 && (
                      <> Consider <Link href="/jobs" className="underline font-semibold" onClick={() => setClearStep('idle')}>exporting a backup</Link> first.</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm font-semibold bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-sm"
                >
                  Yes, delete everything
                </button>
                <button
                  onClick={() => setClearStep('idle')}
                  className="px-4 py-2 text-sm font-medium text-bark-500 bg-white border border-cream-300 rounded-xl hover:bg-cream-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
