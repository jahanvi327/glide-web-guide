import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, FileBadge2, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';
import { UploadPanel } from '@/components/upload-panel';
import { StatusPill } from '@/components/status-pill';

function ReportsPage() {
  const { scan, history, totalScans, realCount, aiCount, unknownCount } = useAnalysis();

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Analytics &amp; reporting</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Reports</h1>
        <p className="mt-1 text-[12px] text-slate-500">Analytics dashboard, downloadable PDF reports, and media authenticity certificates.</p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-600"><BarChart3 size={18} /></div>
          <div><p className="text-[11px] font-semibold text-slate-500">Total Analyzed</p><p className="text-xl font-extrabold text-slate-900">{totalScans}</p></div>
        </div>
        <div className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600"><ShieldCheck size={18} /></div>
          <div><p className="text-[11px] font-semibold text-slate-500">Real Images</p><p className="text-xl font-extrabold text-slate-900">{realCount}</p></div>
        </div>
        <div className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-600"><TrendingUp size={18} /></div>
          <div><p className="text-[11px] font-semibold text-slate-500">AI Generated</p><p className="text-xl font-extrabold text-slate-900">{aiCount}</p></div>
        </div>
        <div className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-50 text-amber-600"><FileBadge2 size={18} /></div>
          <div><p className="text-[11px] font-semibold text-slate-500">Unknown Cases</p><p className="text-xl font-extrabold text-slate-900">{unknownCount}</p></div>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[265px_minmax(420px,1fr)]">
        <UploadPanel />

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[14px] font-extrabold text-slate-800">Media Authenticity Certificate</h2>
            <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-blue-700">
              <Download size={13} />Download PDF
            </button>
          </div>
          <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white p-4">
            <div className="mb-3 flex items-center gap-3 border-b border-blue-100 pb-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-blue-600"><ShieldCheck size={22} /></div>
              <div>
                <p className="text-[14px] font-extrabold text-slate-900">SignalScope Authenticity Report</p>
                <p className="text-[10px] text-slate-500">Scan ID: {scan.scanId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div><p className="font-semibold text-slate-500">Verdict</p><p className="font-bold text-slate-800">{scan.verdict}</p></div>
              <div><p className="font-semibold text-slate-500">Confidence</p><p className="font-bold text-slate-800">{scan.confidence}% ({scan.confidenceLabel})</p></div>
              <div><p className="font-semibold text-slate-500">Generator</p><p className="font-bold text-slate-800">{scan.generator}</p></div>
              <div><p className="font-semibold text-slate-500">Risk Level</p><p className="font-bold text-slate-800">{scan.riskLevel}</p></div>
              <div><p className="font-semibold text-slate-500">AI Probability</p><p className="font-bold text-slate-800">{scan.aiProbability}%</p></div>
              <div><p className="font-semibold text-slate-500">Real Probability</p><p className="font-bold text-slate-800">{scan.realProbability}%</p></div>
              <div><p className="font-semibold text-slate-500">Trust Score</p><p className="font-bold text-slate-800">{scan.trustScore}/100</p></div>
              <div><p className="font-semibold text-slate-500">Date</p><p className="font-bold text-slate-800">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p></div>
            </div>
          </div>
        </section>
      </div>

      <section className="card-shadow mt-3 rounded-xl border border-slate-200/80 bg-white p-4">
        <h2 className="mb-3 text-[14px] font-extrabold text-slate-800">All Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Scan ID</th>
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Prediction</th>
                <th className="px-2 py-2">Confidence</th>
                <th className="px-2 py-2">Trust Score</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Download</th>
              </tr>
            </thead>
            <tbody>
              {history.map((scan) => (
                <tr key={scan.id} className="border-b border-slate-100 text-[10px] text-slate-600 transition hover:bg-blue-50/40">
                  <td className="px-2 py-2.5 font-bold text-slate-400">#{scan.id}</td>
                  <td className="px-2 py-2.5"><img src={scan.image} alt="Scan thumbnail" className="h-8 w-10 rounded object-cover" /></td>
                  <td className="px-2 py-2.5"><StatusPill result={scan.result} /></td>
                  <td className="px-2 py-2.5 font-bold text-slate-700">{scan.confidence}</td>
                  <td className="px-2 py-2.5 font-bold text-slate-700">{scan.trustScore}/100</td>
                  <td className="px-2 py-2.5 whitespace-nowrap">{scan.date}</td>
                  <td className="px-2 py-2.5"><button className="flex items-center gap-1 text-blue-600 hover:text-blue-800"><Download size={13} />PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Reports — SignalScope" },
      { name: "description", content: "Export and share media authenticity reports." },
      { property: "og:title", content: "Reports — SignalScope" },
      { property: "og:description", content: "Export and share media authenticity reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
