import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  ChevronDown,
  CloudUpload,
  FileSearch2,
  History,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Menu,
  Monitor,
  Moon,
  Radar,
  ScanSearch,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';
import { useTheme } from '@/components/theme-provider';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Upload Image', icon: CloudUpload, href: '/dashboard/upload' },
  { label: 'Detection Results', icon: ScanSearch, href: '/dashboard/detection' },
  { label: 'AI Explanations', icon: Lightbulb, href: '/dashboard/explanations' },
  { label: 'Generator Attribution', icon: Radar, href: '/dashboard/attribution' },
  { label: 'Metadata Analysis', icon: FileSearch2, href: '/dashboard/metadata' },
  { label: 'Review Queue', icon: ListChecks, href: '/dashboard/review' },
  { label: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
  { label: 'History', icon: History, href: '/dashboard/history' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileNav, setMobileNav] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const { reviewQueueCount, setNotice } = useAnalysis();
  const { theme, setTheme } = useTheme();

  // Close the drawer on navigation and lock body scroll while it is open.
  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNav ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNav]);

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'] as const;
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
    setNotice(`${next.charAt(0).toUpperCase() + next.slice(1)} mode activated.`);
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'system' ? Monitor : Sun;

  const handleSearch = (val: string) => {
    if (val.startsWith('http') && /\.(jpg|png|webp)/i.test(val)) {
      setNotice('Image URL detected — head to Upload Image to analyze it.');
    }
  };

  return (
    <main className="dashboard-shell flex min-h-screen">
      <aside
        className={`${mobileNav ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[80vw] max-w-[280px] flex-col overflow-y-auto overscroll-contain bg-[#101d33] text-white transition-transform duration-300 sm:w-[260px] lg:relative lg:w-[238px] lg:translate-x-0`}
      >
        <div className="flex h-[78px] shrink-0 items-center gap-3 border-b border-white/10 px-4 sm:px-5">
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3" onClick={() => setMobileNav(false)}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-400 ring-1 ring-blue-400/40 transition-transform duration-300 hover:scale-110">
              <ShieldCheck size={27} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[19px] font-extrabold tracking-tight">SignalScope</p>
              <p className="truncate text-[9px] font-medium tracking-wide text-slate-300">Telling Real From Synthetic</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
            className="ml-auto shrink-0 rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navItems.map(({ label, icon: Icon, href }, i) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                to={href}
                onClick={() => setMobileNav(false)}
                style={{ animationDelay: `${i * 0.04}s` }}
                className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[12px] font-medium transition-all duration-200 lg:py-2.5 ${
                  active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'text-slate-300 hover:bg-white/10 hover:text-white lg:hover:translate-x-1'
                } animate-slide-in-right`}
              >
                <Icon size={17} strokeWidth={1.8} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="truncate">{label}</span>
                {label === 'Review Queue' && reviewQueueCount > 0 && (
                  <span className="ml-auto shrink-0 rounded bg-blue-400/20 px-1.5 py-0.5 text-[9px] animate-pulse">{reviewQueueCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mx-4 mb-5 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-900/80 to-[#19365d] p-4 transition-transform duration-300 hover:scale-[1.02]">
          <div className="mb-3 grid h-8 w-8 place-items-center rounded-full bg-blue-400/20 text-blue-300">
            <ShieldCheck size={18} />
          </div>
          <p className="text-[12px] font-bold">Verify Images.<br />Stop Misinformation.</p>
          <p className="mt-2 text-[10px] leading-4 text-slate-300">AI-powered detection for a safer digital world.</p>
          <div className="mt-4 flex items-end justify-between">
            <div className="h-1 w-16 rounded-full bg-blue-400/70" />
            <span className="text-[9px] text-blue-200">v1.4.0</span>
          </div>
        </div>
      </aside>

      {mobileNav && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] lg:hidden animate-fade-in"
        />
      )}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[64px] items-center gap-2 border-b border-slate-200 bg-white/90 px-3 backdrop-blur-md sm:h-[70px] sm:gap-3 sm:px-6 dark:bg-slate-900/90">
          <button
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
            className="shrink-0 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-300"
          >
            <Menu size={20} />
          </button>

          {/* Search: inline from sm up, toggleable on phones */}
          <div className="relative hidden max-w-[460px] flex-1 sm:block">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              placeholder="Search or paste image URL..."
              className="h-9 w-full rounded-lg border border-blue-100 bg-white pl-9 pr-4 text-[12px] text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setMobileSearch((v) => !v)}
            aria-label="Search"
            className="shrink-0 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 sm:hidden dark:text-slate-300"
          >
            <Search size={18} />
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
            <button
              onClick={cycleTheme}
              className="rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:scale-110 dark:text-slate-300 dark:hover:bg-slate-800"
              title={`Theme: ${theme}`}
              aria-label={`Theme: ${theme}`}
            >
              <ThemeIcon size={18} />
            </button>
            <button
              aria-label="Notifications"
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110"
            >
              <Bell size={18} />
              <span className="absolute right-1 top-0 grid h-3.5 w-3.5 place-items-center rounded-full bg-rose-500 text-[8px] font-bold text-white animate-pulse">
                3
              </span>
            </button>
            <div className="hidden h-7 w-px bg-slate-200 sm:block dark:bg-slate-700" />
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-rose-300 text-[11px] font-bold text-slate-700 transition-transform duration-200 hover:scale-110">
                JR
              </div>
              <div className="hidden min-w-0 md:block">
                <p className="truncate text-[10px] font-bold text-slate-800 dark:text-slate-200">Jhanvi Rajguru</p>
                <p className="truncate text-[9px] text-slate-500 dark:text-slate-400">Student</p>
              </div>
              <ChevronDown size={14} className="hidden shrink-0 text-blue-600 md:block" />
            </div>
          </div>
        </header>

        {mobileSearch && (
          <div className="sticky top-[64px] z-20 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-md sm:hidden dark:bg-slate-900/95 dark:border-slate-700 animate-fade-in">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                autoFocus
                placeholder="Search or paste image URL..."
                className="h-10 w-full rounded-lg border border-blue-100 bg-white pl-9 pr-4 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mx-auto w-full max-w-[1370px] flex-1 px-3 py-4 sm:px-6 sm:py-5 lg:px-7">
          {pathname !== '/dashboard' && (
            <Link
              to="/dashboard"
              className="group mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-all duration-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-600 dark:hover:text-blue-400 animate-fade-in"
            >
              <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          )}
          {children}
        </div>
      </section>
    </main>
  );
}
