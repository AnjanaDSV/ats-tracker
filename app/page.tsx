'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, getDashboardStats, DashboardStats } from '@/lib/storage';
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
  });

  useEffect(() => {
    const all = getJobs();
    setJobs(all);
    setStats(getDashboardStats(all));
  }, []);

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
    </div>
  );
}
