import { createFileRoute } from "@tanstack/react-router";
import { Bell, KeyRound, Monitor, Moon, Palette, ShieldCheck, Sun, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAnalysis } from '@/lib/analysis-context';
import { useTheme } from '@/components/theme-provider';

function SettingsPage() {
  const { setNotice } = useAnalysis();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [unknownDetection, setUnknownDetection] = useState(true);

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200 ${checked ? 'left-4' : 'left-0.5'}`} />
    </button>
  );

  const themeOptions = [
    { mode: 'light' as const, icon: Sun, label: 'Light', desc: 'Bright, clean interface' },
    { mode: 'dark' as const, icon: Moon, label: 'Dark', desc: 'Easy on the eyes' },
    { mode: 'system' as const, icon: Monitor, label: 'System', desc: 'Match your device' },
  ];

  return (
    <>
      <div className="mb-5 animate-slide-up">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Configuration</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">Manage your account, detection preferences, and system configuration.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 stagger">
        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700 hover-lift">
          <div className="mb-3 flex items-center gap-2">
            <UserRound size={18} className="text-blue-600" />
            <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">Profile</h2>
          </div>
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-rose-300 text-[14px] font-bold text-slate-700">JR</div>
            <div>
              <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Jhanvi Rajguru</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Student · Smart India Hackathon</p>
            </div>
          </div>
          <div className="mt-3 space-y-3">
            <div><label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Full Name</label><input defaultValue="Jhanvi Rajguru" className="mt-1 h-8 w-full rounded-md border border-slate-200 px-2 text-[11px] outline-none transition-colors duration-200 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" /></div>
            <div><label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Email</label><input defaultValue="jhanvi@signalscope.ai" className="mt-1 h-8 w-full rounded-md border border-slate-200 px-2 text-[11px] outline-none transition-colors duration-200 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" /></div>
            <div><label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Role</label><select className="mt-1 h-8 w-full rounded-md border border-slate-200 px-2 text-[11px] outline-none transition-colors duration-200 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"><option>Student</option><option>Analyst</option><option>Admin</option></select></div>
          </div>
        </section>

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700 hover-lift">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">Detection Preferences</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div><p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Auto-analysis on upload</p><p className="text-[9px] text-slate-500 dark:text-slate-400">Automatically run detection when an image is uploaded.</p></div>
              <Toggle checked={autoAnalysis} onChange={setAutoAnalysis} />
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div><p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Unknown generator detection</p><p className="text-[9px] text-slate-500 dark:text-slate-400">Flag unseen AI generators using open-set calibration.</p></div>
              <Toggle checked={unknownDetection} onChange={setUnknownDetection} />
            </div>
            <div className="flex items-center justify-between pb-3">
              <div><p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Confidence threshold</p><p className="text-[9px] text-slate-500 dark:text-slate-400">Minimum confidence for auto-verification.</p></div>
              <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">80%</span>
            </div>
          </div>
        </section>

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700 hover-lift">
          <div className="mb-3 flex items-center gap-2">
            <Bell size={18} className="text-amber-600" />
            <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div><p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Email notifications</p><p className="text-[9px] text-slate-500 dark:text-slate-400">Receive alerts for completed analyses.</p></div>
              <Toggle checked={notifications} onChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between pb-3">
              <div><p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Review queue alerts</p><p className="text-[9px] text-slate-500 dark:text-slate-400">Get notified when new images need review.</p></div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </div>
        </section>

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700 hover-lift">
          <div className="mb-3 flex items-center gap-2">
            <KeyRound size={18} className="text-violet-600" />
            <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">API &amp; Integration</h2>
          </div>
          <div className="space-y-3">
            <div><label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">API Key</label><input readOnly value="sk-sig-••••••••••••••••" className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-500 outline-none dark:bg-slate-800 dark:border-slate-600" /></div>
            <div><label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Webhook URL</label><input placeholder="https://your-app.com/webhook" className="mt-1 h-8 w-full rounded-md border border-slate-200 px-2 text-[11px] outline-none transition-colors duration-200 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" /></div>
            <button onClick={() => setNotice('Settings saved successfully.')} className="mt-2 w-full rounded-md bg-blue-600 py-2 text-[10px] font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg">Save Settings</button>
          </div>
        </section>
      </div>

      <section className="card-shadow mt-3 rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700 animate-slide-up">
        <div className="mb-3 flex items-center gap-2">
          <Palette size={18} className="text-blue-600" />
          <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">Appearance</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(({ mode, icon: Icon, label, desc }) => {
            const active = theme === mode;
            return (
              <button
                key={mode}
                onClick={() => { setTheme(mode); setNotice(`${label} mode activated.`); }}
                className={`group relative overflow-hidden rounded-xl border p-4 text-center transition-all duration-300 hover-lift ${
                  active
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500'
                    : 'border-slate-200 text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <div className={`mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full transition-all duration-300 ${active ? 'bg-blue-100 dark:bg-blue-900/50 scale-110' : 'bg-slate-100 dark:bg-slate-800 group-hover:scale-110'}`}>
                  <Icon size={20} />
                </div>
                <p className="text-[12px] font-extrabold">{label}</p>
                <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400">{desc}</p>
                {active && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — SignalScope" },
      { name: "description", content: "Configure detection thresholds and workspace preferences." },
      { property: "og:title", content: "Settings — SignalScope" },
      { property: "og:description", content: "Configure detection thresholds and workspace preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
