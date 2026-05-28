'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Sparkles,
  FileText,
} from 'lucide-react';

const links = [
  { href: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs',      label: 'All Jobs',  icon: Briefcase       },
  { href: '/jobs/new',  label: 'Add Job',   icon: PlusCircle      },
  { href: '/keywords',  label: 'AI Matcher',icon: Sparkles        },
  { href: '/resume',    label: 'Resume',    icon: FileText        },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-cream-100 border-r border-cream-300 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-cream-300">
        <h1 className="text-2xl font-bold tracking-widest text-bark-700">
          TRACK
        </h1>
        <p className="text-xs text-bark-400 mt-0.5 tracking-wide">
          Job Application Tracker
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-bark-600 text-cream-50 shadow-sm'
                  : 'text-bark-600 hover:bg-cream-200 hover:text-bark-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-cream-300">
        <p className="text-[11px] text-bark-400 leading-relaxed">
          Powered by Claude AI
        </p>
      </div>
    </aside>
  );
}
