'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, deleteJob, exportJobsAsJSON } from '@/lib/storage';
import { JobApplication, JobStatus, JOB_STATUSES } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import {
  PlusCircle,
  Search,
  Trash2,
  ExternalLink,
  Briefcase,
  Filter,
  Download,
} from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'All'>('All');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      search === '' ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || j.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  function handleDelete(id: string) {
    deleteJob(id);
    setJobs(getJobs());
    setDeleteConfirm(null);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-bark-800">All Applications</h2>
          <p className="text-bark-400 text-sm mt-1">
            {filtered.length} of {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {jobs.length > 0 && (
            <button
              onClick={exportJobsAsJSON}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-cream-100 border border-cream-300 text-bark-600 text-sm font-medium rounded-xl hover:bg-cream-200 transition-colors"
              title="Export all jobs as JSON"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add Job
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
          <input
            type="text"
            placeholder="Search company or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-cream-300 focus:border-bark-400 focus:outline-none focus:ring-2 focus:ring-bark-400/20 bg-white"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as JobStatus | 'All')}
            className="pl-9 pr-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white focus:border-bark-400 focus:outline-none focus:ring-2 focus:ring-bark-400/20 appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty */}
      {jobs.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-cream-300 bg-cream-100 px-8 py-14 text-center">
          <Briefcase className="w-10 h-10 text-bark-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-bark-700 mb-2">No applications yet</h3>
          <p className="text-bark-400 text-sm mb-6 max-w-xs mx-auto">
            Add your first job application to start tracking your search.
          </p>
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Job
          </Link>
        </div>
      )}

      {/* No results */}
      {jobs.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl border border-cream-300 bg-cream-100 px-8 py-10 text-center">
          <p className="text-bark-500 font-medium">No results match your filters.</p>
          <button
            onClick={() => { setSearch(''); setFilterStatus('All'); }}
            className="text-sm text-bark-400 underline mt-2"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Job list */}
      <div className="space-y-3">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-cream-100 border border-cream-300 rounded-2xl p-5 hover:shadow-card-hover hover:border-bark-300 transition-all duration-150 group"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left side */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-bark-100 border border-bark-200 flex items-center justify-center shrink-0">
                  <span className="text-bark-600 font-bold">
                    {job.company.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-bark-800">{job.company}</p>
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                  <p className="text-sm text-bark-500">{job.role}</p>
                  {job.notes && (
                    <p className="text-xs text-bark-400 mt-1.5 line-clamp-1">
                      {job.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 shrink-0">
                <p className="text-xs text-bark-400 hidden sm:block">
                  {new Date(job.dateApplied).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>

                <Link
                  href={`/jobs/${job.id}`}
                  className="p-2 rounded-lg text-bark-400 hover:text-bark-600 hover:bg-cream-200 transition-colors"
                  title="View details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {deleteConfirm === job.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="px-2.5 py-1 text-xs bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2.5 py-1 text-xs bg-cream-200 text-bark-600 rounded-lg hover:bg-cream-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(job.id)}
                    className="p-2 rounded-lg text-bark-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
