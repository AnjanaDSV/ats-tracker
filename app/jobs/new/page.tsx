'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addJob } from '@/lib/storage';
import { JobFormData, JOB_STATUSES } from '@/lib/types';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const EMPTY_FORM: JobFormData = {
  company: '',
  role: '',
  url: '',
  salaryRange: '',
  dateApplied: new Date().toISOString().split('T')[0],
  jobDescription: '',
  status: 'Applied',
  notes: '',
};

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState<JobFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.role.trim()) e.role = 'Role is required';
    if (!form.dateApplied) e.dateApplied = 'Date applied is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof JobFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const job = addJob(form);
    router.push(`/jobs/${job.id}`);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/jobs"
          className="p-2 rounded-xl text-bark-400 hover:text-bark-600 hover:bg-cream-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-bark-800">Add Application</h2>
          <p className="text-bark-400 text-sm mt-0.5">Track a new job application</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-bark-700 mb-1.5">
              Company <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Anthropic"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
            />
            {errors.company && (
              <p className="text-xs text-rose-500 mt-1">{errors.company}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-bark-700 mb-1.5">
              Role / Position <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
            />
            {errors.role && (
              <p className="text-xs text-rose-500 mt-1">{errors.role}</p>
            )}
          </div>
        </div>

        {/* Job URL & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-bark-700 mb-1.5">
              Job Posting URL
            </label>
            <input
              type="text"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://jobs.company.com/…"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bark-700 mb-1.5">
              Salary Range
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

        {/* Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-bark-700 mb-1.5">
              Date Applied <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
            />
            {errors.dateApplied && (
              <p className="text-xs text-rose-500 mt-1">{errors.dateApplied}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-bark-700 mb-1.5">
              Status
            </label>
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
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-bark-700 mb-1.5">
            Job Description
          </label>
          <textarea
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            rows={6}
            placeholder="Paste the job description here — used for AI keyword matching…"
            className="w-full px-4 py-3 text-sm rounded-xl border border-cream-300 bg-white resize-none leading-relaxed"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-bark-700 mb-1.5">
            Notes
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Recruiter contact, interview details, next steps…"
            className="w-full px-4 py-3 text-sm rounded-xl border border-cream-300 bg-white resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Application'}
          </button>
          <Link
            href="/jobs"
            className="px-4 py-2.5 text-sm font-medium text-bark-500 hover:text-bark-700 rounded-xl hover:bg-cream-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
