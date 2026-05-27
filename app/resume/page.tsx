'use client';

import { useEffect, useState } from 'react';
import { getResume, saveResume } from '@/lib/storage';
import { FileText, Save, CheckCircle2, Trash2 } from 'lucide-react';

export default function ResumePage() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const stored = getResume();
    setText(stored);
    countWords(stored);
  }, []);

  function countWords(value: string) {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setCharCount(value.length);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    countWords(val);
    setSaved(false);
  }

  function handleSave() {
    saveResume(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleClear() {
    if (confirm('Clear your saved resume? This cannot be undone.')) {
      setText('');
      setWordCount(0);
      setCharCount(0);
      saveResume('');
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-6 h-6 text-bark-500" />
          <h2 className="text-3xl font-bold text-bark-800">My Resume</h2>
        </div>
        <p className="text-bark-400 text-sm">
          Paste your resume here. It's stored locally and used by the AI Keyword Matcher.
        </p>
      </div>

      {/* Info card */}
      <div className="mb-6 p-4 bg-cream-100 border border-cream-300 rounded-xl">
        <p className="text-sm text-bark-600 leading-relaxed">
          <span className="font-semibold">Privacy note:</span> Your resume is stored only in
          your browser's localStorage — it never leaves your device except when you run the
          AI keyword matcher, where it's sent to Claude for analysis.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleChange}
          rows={22}
          placeholder={`Paste your full resume text here…\n\nExample:\nJane Smith\njane@email.com | linkedin.com/in/janesmith\n\nEXPERIENCE\nSoftware Engineer — Acme Corp (2022–Present)\n• Built scalable APIs using Python and FastAPI\n• Improved test coverage by 40% with pytest\n\nSKILLS\nPython, JavaScript, React, Node.js, SQL, AWS, Docker…`}
          className="w-full px-5 py-4 text-sm rounded-2xl border border-cream-300 bg-white resize-none leading-relaxed font-mono"
        />
        {/* Word/char count */}
        <div className="absolute bottom-3 right-3 flex gap-3">
          <span className="text-xs text-bark-400">{wordCount} words</span>
          <span className="text-xs text-bark-300">|</span>
          <span className="text-xs text-bark-400">{charCount} chars</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Resume
            </>
          )}
        </button>

        {text && (
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
            ✓ Resume saved to browser storage
          </span>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 p-5 bg-cream-100 border border-cream-300 rounded-2xl">
        <h4 className="text-sm font-semibold text-bark-700 mb-3">Tips for best results</h4>
        <ul className="space-y-1.5 text-sm text-bark-500">
          <li>• Paste plain text (not formatted from Word/PDF)</li>
          <li>• Include your skills section with specific technologies</li>
          <li>• Include your experience with action verbs and tools used</li>
          <li>• Keep it updated — re-save whenever you update your resume</li>
        </ul>
      </div>
    </div>
  );
}
