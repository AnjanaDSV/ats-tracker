'use client';

import { useEffect, useState } from 'react';
import {
  getGaps,
  addGap,
  updateGap,
  deleteGap,
  SkillGap,
  GapCategory,
  GapPriority,
  GapStatus,
  GapFormData,
} from '@/lib/storage';
import { PlusCircle, X, Trash2, ChevronDown } from 'lucide-react';

const CATEGORIES: { value: GapCategory; label: string }[] = [
  { value: 'tools',    label: 'Tools'    },
  { value: 'concepts', label: 'Concepts' },
  { value: 'domain',   label: 'Domain'   },
  { value: 'certs',    label: 'Certs'    },
];

const PRIORITIES: { value: GapPriority; label: string }[] = [
  { value: 'high',   label: 'High'   },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low'    },
];

const STATUSES: { value: GapStatus; label: string }[] = [
  { value: 'Open',     label: 'Open'     },
  { value: 'Learning', label: 'Learning' },
  { value: 'Done',     label: 'Done'     },
];

const categoryColors: Record<GapCategory, string> = {
  tools:    'bg-sky-100 text-sky-700 border-sky-200',
  concepts: 'bg-violet-100 text-violet-700 border-violet-200',
  domain:   'bg-amber-100 text-amber-700 border-amber-200',
  certs:    'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const priorityColors: Record<GapPriority, string> = {
  high:   'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low:    'bg-stone-100 text-stone-600 border-stone-200',
};

const statusColors: Record<GapStatus, string> = {
  Open:     'bg-cream-100 text-bark-600 border-cream-300',
  Learning: 'bg-sky-100 text-sky-700 border-sky-200',
  Done:     'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const emptyForm: GapFormData = {
  name: '',
  category: 'tools',
  priority: 'high',
  status: 'Open',
  howToFix: '',
  companies: '',
};

export default function GapsPage() {
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<GapFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<GapCategory | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<GapPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<GapStatus | 'all'>('all');

  useEffect(() => {
    setGaps(getGaps());
  }, []);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(gap: SkillGap) {
    setForm({
      name: gap.name,
      category: gap.category,
      priority: gap.priority,
      status: gap.status,
      howToFix: gap.howToFix,
      companies: gap.companies,
    });
    setEditingId(gap.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateGap(editingId, form);
    } else {
      addGap(form);
    }
    setGaps(getGaps());
    closeForm();
  }

  function handleDelete(id: string) {
    deleteGap(id);
    setGaps(getGaps());
  }

  function handleStatusCycle(gap: SkillGap) {
    const order: GapStatus[] = ['Open', 'Learning', 'Done'];
    const next = order[(order.indexOf(gap.status) + 1) % order.length];
    updateGap(gap.id, { status: next });
    setGaps(getGaps());
  }

  const filtered = gaps.filter((g) => {
    if (filterCategory !== 'all' && g.category !== filterCategory) return false;
    if (filterPriority !== 'all' && g.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-bark-800">Skill Gaps</h2>
          <p className="text-bark-400 mt-1 text-sm">
            Track what you need to learn and close the gap.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Gap
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterSelect
          label="Category"
          value={filterCategory}
          onChange={(v) => setFilterCategory(v as GapCategory | 'all')}
          options={[{ value: 'all', label: 'All Categories' }, ...CATEGORIES.map(c => ({ value: c.value, label: c.label }))]}
        />
        <FilterSelect
          label="Priority"
          value={filterPriority}
          onChange={(v) => setFilterPriority(v as GapPriority | 'all')}
          options={[{ value: 'all', label: 'All Priorities' }, ...PRIORITIES.map(p => ({ value: p.value, label: p.label }))]}
        />
        <FilterSelect
          label="Status"
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as GapStatus | 'all')}
          options={[{ value: 'all', label: 'All Statuses' }, ...STATUSES.map(s => ({ value: s.value, label: s.label }))]}
        />
        {(filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all') && (
          <button
            onClick={() => { setFilterCategory('all'); setFilterPriority('all'); setFilterStatus('all'); }}
            className="text-xs text-bark-400 hover:text-bark-600 underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Empty state */}
      {gaps.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-cream-300 bg-cream-100 px-8 py-14 text-center">
          <div className="w-10 h-10 rounded-xl bg-bark-100 border border-bark-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-bark-500 font-bold text-lg">?</span>
          </div>
          <h3 className="text-lg font-semibold text-bark-700 mb-2">No skill gaps tracked yet</h3>
          <p className="text-bark-400 text-sm mb-6 max-w-xs mx-auto">
            Add gaps you've noticed from job descriptions or interviews.
          </p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add Your First Gap
          </button>
        </div>
      )}

      {/* No results from filter */}
      {gaps.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl border border-cream-300 bg-cream-100 px-8 py-10 text-center">
          <p className="text-bark-500 text-sm">No gaps match your current filters.</p>
        </div>
      )}

      {/* Cards grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((gap) => (
            <GapCard
              key={gap.id}
              gap={gap}
              onEdit={() => openEdit(gap)}
              onDelete={() => handleDelete(gap.id)}
              onStatusCycle={() => handleStatusCycle(gap)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-bark-900/30 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-cream-300 w-full max-w-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-bark-800">
                {editingId ? 'Edit Gap' : 'Add Skill Gap'}
              </h3>
              <button onClick={closeForm} className="text-bark-400 hover:text-bark-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1">Gap Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kubernetes, System Design, AWS"
                  className="w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as GapCategory })}
                    className="w-full px-3 py-2 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as GapPriority })}
                    className="w-full px-3 py-2 text-sm"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as GapStatus })}
                    className="w-full px-3 py-2 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1">How to Fix It</label>
                <textarea
                  value={form.howToFix}
                  onChange={(e) => setForm({ ...form, howToFix: e.target.value })}
                  placeholder="e.g. Complete Docker/K8s course on Udemy, build a side project"
                  rows={3}
                  className="w-full px-3 py-2 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1">Companies That Flagged It</label>
                <input
                  type="text"
                  value={form.companies}
                  onChange={(e) => setForm({ ...form, companies: e.target.value })}
                  placeholder="e.g. Google, Meta, Stripe"
                  className="w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-bark-600 text-cream-50 text-sm font-medium rounded-xl hover:bg-bark-700 transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add Gap'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 text-sm font-medium text-bark-500 bg-cream-100 border border-cream-300 rounded-xl hover:bg-cream-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl text-bark-700 cursor-pointer hover:border-bark-300 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-bark-400 pointer-events-none" />
    </div>
  );
}

function GapCard({
  gap,
  onEdit,
  onDelete,
  onStatusCycle,
}: {
  gap: SkillGap;
  onEdit: () => void;
  onDelete: () => void;
  onStatusCycle: () => void;
}) {
  const companies = gap.companies
    ? gap.companies.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-cream-100 border border-cream-300 rounded-2xl p-5 hover:shadow-card-hover hover:border-bark-300 transition-all duration-150 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-bark-800 text-base leading-snug">{gap.name}</h4>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onEdit}
            className="text-xs text-bark-400 hover:text-bark-600 px-2 py-1 rounded-lg hover:bg-cream-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-bark-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColors[gap.category]}`}>
          {CATEGORIES.find(c => c.value === gap.category)?.label}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[gap.priority]}`}>
          {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)} Priority
        </span>
        <button
          onClick={onStatusCycle}
          title="Click to advance status"
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${statusColors[gap.status]}`}
        >
          {gap.status}
        </button>
      </div>

      {/* How to fix */}
      {gap.howToFix && (
        <div>
          <p className="text-xs font-medium text-bark-500 uppercase tracking-wide mb-1">How to Fix</p>
          <p className="text-sm text-bark-700 leading-relaxed">{gap.howToFix}</p>
        </div>
      )}

      {/* Companies */}
      {companies.length > 0 && (
        <div>
          <p className="text-xs font-medium text-bark-500 uppercase tracking-wide mb-1.5">Flagged by</p>
          <div className="flex flex-wrap gap-1.5">
            {companies.map((c) => (
              <span
                key={c}
                className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white border border-cream-300 text-xs text-bark-600"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
