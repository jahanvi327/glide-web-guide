import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Download,
  Eye,
  FileBadge2,
  FileCheck2,
  History as HistoryIcon,
  Image as ImageIcon,
  MoreVertical,
  ShieldCheck,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAnalysis } from '@/lib/analysis-context';
import { UploadPanel } from '@/components/upload-panel';
import { AnalysisResultCard } from '@/components/analysis-result-card';
import { InsightPanel } from '@/components/insight-panel';
import { StatusPill } from '@/components/status-pill';

function KpiCard({ icon, label, value, change, tone }: { icon: React.ReactNode; label: string; value: string; change: string; tone: string }) {
  return (
    <div className="card-shadow flex min-w-0 items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 dark:bg-slate-900 dark:border-slate-700 hover-lift">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tone} transition-transform duration-300 hover:scale-110`}>{icon}</div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">{change}</span>
        </div>
        <p className="text-[9px] text-slate-400 dark:text-slate-500">vs. last 7 days</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { totalScans, realCount, aiCount, unknownCount, history } = useAnalysis();

  return (
    <>
      <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center animate-slide-up">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600 dark:text-blue-400">Trust intelligence workspace</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Welcome back, Jhanvi!</h1>
          <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">Upload an image to check if it&apos;s real or AI-generated.</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 stagger">
          <KpiCard icon={<ImageIcon size={18} />} label="Total Scans" value={String(totalScans)} change="↑ 12%" tone="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
          <KpiCard icon={<ShieldCheck size={18} />} label="Real Images" value={String(realCount)} change="↑ 8%" tone="bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400" />
          <KpiCard icon={<AlertTriangle size={18} />} label="AI Generated" value={String(aiCount)} change="↑ 18%" tone="bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400" />
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[265px_minmax(420px,1fr)_344px]">
        <div className="animate-slide-up"><UploadPanel /></div>
        <div className="animate-slide-up" style={{ animationDelay: '.1s' }}><AnalysisResultCard /></div>
        <div className="animate-slide-up" style={{ animationDelay: '.15s' }}><InsightPanel /></div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4 stagger">
        <Link to="/dashboard/attribution" className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition-all duration-200 hover-lift dark:bg-slate-900 dark:border-slate-700">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"><Activity size={17} /></div>
          <div><p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Generator Attribution</p><p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-slate-400">Identify the likely generator family.</p></div>
          <ArrowUpRight size={14} className="ml-auto text-slate-400 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <Link to="/dashboard/metadata" className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition-all duration-200 hover-lift dark:bg-slate-900 dark:border-slate-700">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"><FileBadge2 size={17} /></div>
          <div><p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Metadata Analysis</p><p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-slate-400">Check EXIF &amp; C2PA credentials.</p></div>
          <ArrowUpRight size={14} className="ml-auto text-slate-400" />
        </Link>
        <Link to="/dashboard/detection" className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition-all duration-200 hover-lift dark:bg-slate-900 dark:border-slate-700">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><FileCheck2 size={17} /></div>
          <div><p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Image + Caption Check</p><p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-slate-400">Verify image matches the provided text.</p></div>
          <ArrowUpRight size={14} className="ml-auto text-slate-400" />
        </Link>
        <Link to="/dashboard/history" className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition-all duration-200 hover-lift dark:bg-slate-900 dark:border-slate-700">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"><HistoryIcon size={17} /></div>
          <div><p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Scan History</p><p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-slate-400">Review all past authenticity checks.</p></div>
          <ArrowUpRight size={14} className="ml-auto text-slate-400" />
        </Link>
      </div>

      <section className="card-shadow mt-3 rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700 animate-slide-up">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">Recent Analysis</h2>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">Your latest media trust checks</p>
          </div>
          <Link to="/dashboard/history" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">View All <ArrowUpRight className="ml-1 inline" size={12} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Prediction</th>
                <th className="px-2 py-2">Confidence</th>
                <th className="px-2 py-2">Generator</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 5).map((scan, index) => (
                <tr key={scan.id} className="border-b border-slate-100 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 transition-colors duration-200 hover:bg-blue-50/40 dark:hover:bg-slate-800/50">
                  <td className="px-2 py-2.5 font-bold text-slate-400 dark:text-slate-500">{index + 1}</td>
                  <td className="px-2 py-2.5"><img src={scan.image} alt="Scan thumbnail" className="h-8 w-10 rounded object-cover transition-transform duration-200 hover:scale-110" /></td>
                  <td className="px-2 py-2.5"><StatusPill result={scan.result} /></td>
                  <td className="px-2 py-2.5 font-bold text-slate-700 dark:text-slate-300">{scan.confidence}</td>
                  <td className="px-2 py-2.5">{scan.generator}</td>
                  <td className="px-2 py-2.5 whitespace-nowrap">{scan.date}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex gap-2 text-slate-500 dark:text-slate-400">
                      <Link to="/dashboard/detection" aria-label="View scan" className="transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"><Eye size={14} /></Link>
                      <Link to="/dashboard/reports" aria-label="Download report" className="transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"><Download size={14} /></Link>
                      <button aria-label="More actions" className="transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"><MoreVertical size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "SignalScope Dashboard" },
      { name: "description", content: "Trust intelligence workspace for image authenticity checks." },
      { property: "og:title", content: "SignalScope Dashboard" },
      { property: "og:description", content: "Trust intelligence workspace for image authenticity checks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
