import { JobStatus } from '@/lib/types';

interface Props {
  status: JobStatus;
  size?: 'sm' | 'md';
}

const config: Record<JobStatus, { bg: string; text: string; ring: string }> = {
  Browsing:      { bg: 'bg-cream-100',  text: 'text-bark-500',   ring: 'ring-cream-300'  },
  'Skill Gap':   { bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-200' },
  Applied:       { bg: 'bg-sky-100',    text: 'text-sky-700',    ring: 'ring-sky-200'    },
  'Phone Screen':{ bg: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-200' },
  Interview:     { bg: 'bg-amber-100',  text: 'text-amber-700',  ring: 'ring-amber-200'  },
  Offer:         { bg: 'bg-emerald-100',text: 'text-emerald-700',ring: 'ring-emerald-200'},
  Rejected:      { bg: 'bg-rose-100',   text: 'text-rose-700',   ring: 'ring-rose-200'   },
  Ghosted:       { bg: 'bg-stone-100',  text: 'text-stone-500',  ring: 'ring-stone-200'  },
};

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { bg, text, ring } = config[status];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ring-1 ${bg} ${text} ${ring} ${sizeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
