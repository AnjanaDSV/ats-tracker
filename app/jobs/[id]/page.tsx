'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getJob, updateJob, deleteJob } from '@/lib/storage';
import { JobApplication, JobFormData, JOB_STATUSES } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import {
  ArrowLeft,
  Edit3,
  Save,
  Trash2,
  Sparkles,
  X,
  CalendarDays,
  Building2,
  Briefcase,
  FileText,
  StickyNote,
  Link2,
  DollarSign,
  ExternalLink,
} from 'lucide-react';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = useState<JobApplication | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<JobFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = getJob(id);
    if (!found) { setNotFound(true); return; }
    setJob(found);
    setForm({
      company: found.company,
      role: found.role,
      url: found.url ?? '',
      salaryRange: found.salaryRange ?? '',
      dateApplied: found.dateApplied,
      jobDescription: found.jobDescription,
      status: found.status,
      notes: found.notes,
    });
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : null);
  }

  function handleSave() {
    if (!form) return;
    setSaving(true);
    const updated = updateJob(id, form);
    if (updated) setJob(updated);
    setSaving(false);
    setEditing(false);
  }

  function cancelEdit() {
    if (!job) return;
    setEditing(false);
    setForm({
      company: job.company,
      role: job.role,
      url: job.url ?? '',
      salaryRange: job.salaryRange ?? '',
      dateApplied: job.dateApplied,
      jobDescription: job.jobDescription,
      status: job.status,
      notes: job.notes,
    });
  }

  function handleDelete() {
    deleteJob(id);
    router.push('/jobs');
  }

  if (notFound) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20">
        <p className="text-bark-500 font-medium mb-4">Application not found.</p>
        <Link href="/jobs" className="text-bark-600 underline text-sm">Back to jobs</Link>
      </div>
    );
  }

  if (!job || !form) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cream-200 rounded-xl w-48" />
          <div className="h-4 bg-cream-200 rounded w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="p-2 rounded-xl text-bark-400 hover:text-bark-600 hover:bg-cream-200 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-bark-800">{job.company}</h2>
            <p className="text-bark-500 text-sm mt-0.5">{job.role}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-bark-600 bg-cream-100 border border-cream-300 rounded-xl hover:bg-cream-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              {deleteConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDelete}
                    className="px-3 py-2 text-sm bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="p-2 text-bark-400 hover:text-bark-600 rounded-xl hover:bg-cream-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="p-2 text-bark-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-bark-600 text-cream-50 rounded-xl hover:bg-bark-700 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={cancelEdit}
                className="p-2 text-bark-400 hover:text-bark-600 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status badge (view mode) */}
      {!editing && (
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <StatusBadge status={job.status} />
          {job.salaryRange && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-cream-200 text-bark-600 rounded-full border border-cream-300">
              <DollarSign className="w-3 h-3" />
              {job.salaryRange}
            </span>
          )}
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-sky-50 text-sky-600 rounded-full border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Posting
            </a>
          )}
        </div>
      )}

      <div className="space-y-5">
        {/* Company & Role (edit mode) */}
        {editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
                <Building2 className="w-3.5 h-3.5" /> Company
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Role
              </label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>
        )}

        {/* URL & Salary (edit mode) */}
        {editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
                <Link2 className="w-3.5 h-3.5" /> Job Posting URL
              </label>
              <input
                type="text"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://…"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Salary Range
              </label>
              <input
                type="text"
                name="salaryRange"
                value={form.salaryRange}
                onChange={handleChange}
                placeholder="e.g. $120k – $150k"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>
        )}

        {/* Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> Date Applied
            </p>
            {editing ? (
              <input
                type="date"
                name="dateApplied"
                value={form.dateApplied}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
              />
            ) : (
              <p className="text-bark-800 text-sm px-4 py-2.5 bg-cream-100 rounded-xl border border-cream-300">
                {new Date(job.dateApplied).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            )}
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
              Status
            </p>
            {editing ? (
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <div className="px-4 py-2.5 bg-cream-100 rounded-xl border border-cream-300">
                <StatusBadge status={job.status} size="sm" />
              </div>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
            <FileText className="w-3.5 h-3.5" /> Job Description
          </p>
          {editing ? (
            <textarea
              name="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 text-sm rounded-xl border border-cream-300 bg-white resize-none leading-relaxed"
            />
          ) : job.jobDescription ? (
            <div className="px-4 py-3 bg-cream-100 rounded-xl border border-cream-300 text-sm text-bark-700 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
              {job.jobDescription}
            </div>
          ) : (
            <p className="text-bark-400 text-sm px-4 py-3 bg-cream-100 rounded-xl border border-cream-300 border-dashed italic">
              No description added.
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-bark-600 mb-1.5">
            <StickyNote className="w-3.5 h-3.5" /> Notes
          </p>
          {editing ? (
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 text-sm rounded-xl border border-cream-300 bg-white resize-none"
            />
          ) : job.notes ? (
            <div className="px-4 py-3 bg-cream-100 rounded-xl border border-cream-300 text-sm text-bark-700 leading-relaxed whitespace-pre-wrap">
              {job.notes}
            </div>
          ) : (
            <p className="text-bark-400 text-sm px-4 py-3 bg-cream-100 rounded-xl border border-cream-300 border-dashed italic">
              No notes added.
            </p>
          )}
        </div>

        {/* Timestamps */}
        <div className="pt-2 border-t border-cream-300 flex items-center gap-6 text-xs text-bark-400">
          <span>Added {new Date(job.createdAt).toLocaleDateString()}</span>
          <span>Updated {new Date(job.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* AI Keyword Match link */}
        {job.jobDescription && (
          <Link
            href={`/keywords?jobId=${job.id}`}
            className="flex items-center gap-2 px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl text-sm text-violet-700 font-medium hover:bg-violet-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Run AI Keyword Match for this job
          </Link>
        )}
      </div>
    </div>
  );
}
