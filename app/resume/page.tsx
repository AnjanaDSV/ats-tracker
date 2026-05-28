'use client';

import { useEffect, useRef, useState } from 'react';
import { getResume, saveResume } from '@/lib/storage';
import {
  FileText,
  Save,
  CheckCircle2,
  Trash2,
  Upload,
  FileUp,
  Loader2,
  AlertCircle,
  ClipboardPaste,
} from 'lucide-react';

type Tab = 'paste' | 'upload';

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<Tab>('paste');

  // Paste tab state
  const [pasteText, setPasteText] = useState('');

  // Upload tab state
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');

  // Shared
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const stored = getResume();
    setPasteText(stored);
  }, []);

  // ── Paste tab ─────────────────────────────────────────────────────────────
  function handlePasteChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPasteText(e.target.value);
    setSaved(false);
  }

  function handlePasteSave() {
    saveResume(pasteText);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleClear() {
    if (!confirm('Clear your saved resume? This cannot be undone.')) return;
    setPasteText('');
    setExtractedText('');
    setFile(null);
    saveResume('');
  }

  // ── Upload tab ────────────────────────────────────────────────────────────
  async function extractFromFile(f: File) {
    setFile(f);
    setExtractedText('');
    setExtractError('');
    setExtracting(true);

    const form = new FormData();
    form.append('file', f);

    try {
      const res = await fetch('/api/parse-resume', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed.');
      setExtractedText(data.text);
    } catch (err: unknown) {
      setExtractError(err instanceof Error ? err.message : 'Failed to read file.');
    } finally {
      setExtracting(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) extractFromFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) extractFromFile(f);
  }

  function handleUploadSave() {
    if (!extractedText.trim()) return;
    saveResume(extractedText);
    setPasteText(extractedText); // sync paste tab too
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const activeText = activeTab === 'paste' ? pasteText : extractedText;
  const wordCount = activeText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = activeText.length;

  const savedResume = typeof window !== 'undefined' ? !!getResume() : false;

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-6 h-6 text-bark-500" />
          <h2 className="text-3xl font-bold text-bark-800">My Resume</h2>
        </div>
        <p className="text-bark-400 text-sm">
          Upload a file or paste your resume text. Used by the AI Keyword Matcher.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-cream-200 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'paste'
              ? 'bg-bark-600 text-cream-50 shadow-sm'
              : 'text-bark-500 hover:text-bark-700'
          }`}
        >
          <ClipboardPaste className="w-4 h-4" />
          Paste Text
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-bark-600 text-cream-50 shadow-sm'
              : 'text-bark-500 hover:text-bark-700'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      {/* ── Paste tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'paste' && (
        <div className="animate-fade-in">
          <div className="relative">
            <textarea
              value={pasteText}
              onChange={handlePasteChange}
              rows={20}
              placeholder={`Paste your full resume text here…\n\nExample:\nJane Smith\njane@email.com | linkedin.com/in/janesmith\n\nEXPERIENCE\nSoftware Engineer — Acme Corp (2022–Present)\n• Built scalable APIs using Python and FastAPI\n\nSKILLS\nPython, JavaScript, React, SQL, AWS, Docker…`}
              className="w-full px-5 py-4 text-sm rounded-2xl border border-cream-300 bg-white resize-none leading-relaxed font-mono"
            />
            <div className="absolute bottom-3 right-3 flex gap-3">
              <span className="text-xs text-bark-400">{wordCount} words</span>
              <span className="text-xs text-bark-300">|</span>
              <span className="text-xs text-bark-400">{charCount} chars</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handlePasteSave}
              disabled={!pasteText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-300" />Saved!</>
              ) : (
                <><Save className="w-4 h-4" />Save Resume</>
              )}
            </button>
            {(pasteText || savedResume) && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
            {saved && (
              <span className="text-sm text-emerald-600 font-medium animate-fade-in">
                ✓ Saved to browser storage
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Upload tab ────────────────────────────────────────────────────── */}
      {activeTab === 'upload' && (
        <div className="animate-fade-in space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 px-8 py-14 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
              dragging
                ? 'border-bark-500 bg-bark-50'
                : 'border-cream-300 bg-cream-100 hover:border-bark-400 hover:bg-cream-200'
            }`}
          >
            <FileUp className={`w-10 h-10 ${dragging ? 'text-bark-600' : 'text-bark-300'}`} />
            <div className="text-center">
              <p className="text-sm font-medium text-bark-700">
                Drop your resume here or{' '}
                <span className="text-bark-600 underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-bark-400 mt-1">.pdf · .docx · .txt &nbsp;·&nbsp; max 10 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Extracting spinner */}
          {extracting && (
            <div className="flex items-center gap-3 px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl">
              <Loader2 className="w-4 h-4 text-bark-500 animate-spin" />
              <p className="text-sm text-bark-600">Extracting text from <span className="font-medium">{file?.name}</span>…</p>
            </div>
          )}

          {/* Extract error */}
          {extractError && (
            <div className="flex items-start gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">{extractError}</p>
            </div>
          )}

          {/* Extracted preview */}
          {extractedText && !extracting && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-bark-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Extracted from <span className="text-bark-500">{file?.name}</span>
                </p>
                <span className="text-xs text-bark-400">{wordCount} words</span>
              </div>
              <div className="relative">
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={16}
                  className="w-full px-5 py-4 text-sm rounded-2xl border border-cream-300 bg-white resize-none leading-relaxed font-mono"
                />
                <p className="text-xs text-bark-400 mt-1.5">
                  You can edit the text above before saving.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleUploadSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm"
                >
                  {saved ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-300" />Saved!</>
                  ) : (
                    <><Save className="w-4 h-4" />Save Resume</>
                  )}
                </button>
                {saved && (
                  <span className="text-sm text-emerald-600 font-medium animate-fade-in">
                    ✓ Saved to browser storage
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 p-5 bg-cream-100 border border-cream-300 rounded-2xl">
        <h4 className="text-sm font-semibold text-bark-700 mb-3">Tips for best results</h4>
        <ul className="space-y-1.5 text-sm text-bark-500">
          <li>• Use a text-based PDF (not a scanned image) for accurate extraction</li>
          <li>• Plain .txt or .docx files give the cleanest output</li>
          <li>• Include your skills section with specific technologies and tools</li>
          <li>• After uploading, edit the extracted text if anything looks off</li>
        </ul>
      </div>
    </div>
  );
}
