'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getJobs, getResume } from '@/lib/storage';
import { JobApplication, KeywordAnalysis } from '@/lib/types';
import { Sparkles, AlertCircle, CheckCircle2, XCircle, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';

function KeywordsContent() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [jobDesc, setJobDesc] = useState('');
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<KeywordAnalysis | null>(null);

  useEffect(() => {
    const allJobs = getJobs();
    setJobs(allJobs);
    setResume(getResume());

    if (jobIdParam) {
      const found = allJobs.find((j) => j.id === jobIdParam);
      if (found) {
        setSelectedJobId(found.id);
        setJobDesc(found.jobDescription);
      }
    }
  }, [jobIdParam]);

  function handleJobSelect(id: string) {
    setSelectedJobId(id);
    setResult(null);
    setError('');
    if (id === '') {
      setJobDesc('');
      return;
    }
    const found = jobs.find((j) => j.id === id);
    if (found) setJobDesc(found.jobDescription);
  }

  async function handleAnalyze() {
    if (!jobDesc.trim()) {
      setError('Please enter a job description.');
      return;
    }
    if (!resume.trim()) {
      setError('No resume found — please add your resume on the Resume page first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobDesc, resume }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data as KeywordAnalysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    !result ? ''
    : result.matchScore >= 70 ? 'text-emerald-600'
    : result.matchScore >= 40 ? 'text-amber-600'
    : 'text-rose-600';

  const scoreBg =
    !result ? ''
    : result.matchScore >= 70 ? 'bg-emerald-50 border-emerald-200'
    : result.matchScore >= 40 ? 'bg-amber-50 border-amber-200'
    : 'bg-rose-50 border-rose-200';

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-6 h-6 text-bark-500" />
          <h2 className="text-3xl font-bold text-bark-800">AI Keyword Matcher</h2>
        </div>
        <p className="text-bark-400 text-sm">
          Compare a job description against your resume to find matching and missing keywords.
        </p>
      </div>

      {/* Resume warning */}
      {!resume && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700">No resume saved</p>
            <p className="text-xs text-amber-600 mt-0.5">
              You need to{' '}
              <Link href="/resume" className="underline font-semibold">
                add your resume
              </Link>{' '}
              before running a keyword match.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Job selector */}
        <div>
          <label className="block text-sm font-medium text-bark-700 mb-1.5">
            Load from saved application (optional)
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => handleJobSelect(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-cream-300 bg-white"
          >
            <option value="">— paste description manually —</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.company} — {j.role}
              </option>
            ))}
          </select>
        </div>

        {/* Job description */}
        <div>
          <label className="block text-sm font-medium text-bark-700 mb-1.5">
            Job Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => { setJobDesc(e.target.value); setResult(null); setError(''); }}
            rows={9}
            placeholder="Paste the full job description here…"
            className="w-full px-4 py-3 text-sm rounded-xl border border-cream-300 bg-white resize-none leading-relaxed"
          />
        </div>

        {/* Resume preview */}
        {resume && (
          <div className="flex items-start gap-3 p-3 bg-cream-100 border border-cream-300 rounded-xl">
            <FileText className="w-4 h-4 text-bark-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-bark-600">Resume loaded</p>
              <p className="text-xs text-bark-400 mt-0.5 truncate">
                {resume.slice(0, 80)}…
              </p>
            </div>
            <Link href="/resume" className="text-xs text-bark-500 underline shrink-0">
              Edit
            </Link>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !jobDesc.trim() || !resume.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-bark-600 text-cream-50 font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing with Claude…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Keywords
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-5 animate-slide-up">
          {/* Score */}
          <div className={`rounded-2xl border p-6 ${scoreBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-bark-600">Match Score</p>
                <p className={`text-5xl font-bold mt-1 ${scoreColor}`}>
                  {result.matchScore}
                  <span className="text-2xl">%</span>
                </p>
              </div>
              <div
                className="w-20 h-20 rounded-full border-8 flex items-center justify-center"
                style={{
                  borderColor: result.matchScore >= 70 ? '#6ee7b7' : result.matchScore >= 40 ? '#fcd34d' : '#fca5a5',
                }}
              >
                <span className={`text-lg font-bold ${scoreColor}`}>{result.matchScore}%</span>
              </div>
            </div>
            {result.summary && (
              <p className="text-sm text-bark-700 mt-4 leading-relaxed border-t border-current/10 pt-4">
                {result.summary}
              </p>
            )}
          </div>

          {/* Matching keywords */}
          {result.matchingKeywords.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h4 className="text-sm font-semibold text-bark-700">
                  Matching Keywords ({result.matchingKeywords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matchingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing keywords */}
          {result.missingKeywords.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-rose-500" />
                <h4 className="text-sm font-semibold text-bark-700">
                  Missing Keywords ({result.missingKeywords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 ring-1 ring-rose-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <p className="text-xs text-bark-400 mt-3">
                Consider adding these to your resume or cover letter if you have the relevant experience.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function KeywordsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-bark-400 text-sm">Loading…</div>}>
      <KeywordsContent />
    </Suspense>
  );
}
