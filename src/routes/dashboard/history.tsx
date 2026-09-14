import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, History as HistoryIcon, MoreVertical } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAnalysis } from '@/lib/analysis-context';
import { StatusPill } from '@/components/status-pill';

function HistoryPage() {
  const { history } = useAnalysis();

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Audit trail</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Scan History</h1>
        <p className="mt-1 text-[12px] text-slate-500">Complete record of all images analyzed through SignalScope.</p>
      </div>

      <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <HistoryIcon size={18} className="text-blue-600" />
          <h2 className="text-[14px] font-extrabold text-slate-800">All Scans ({history.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Scan ID</th>
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Prediction</th>
                <th className="px-2 py-2">Confidence</th>
                <th className="px-2 py-2">Generator</th>
                <th className="px-2 py-2">Trust Score</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((scan, index) => (
                <tr key={scan.id} className="border-b border-slate-100 text-[10px] text-slate-600 transition hover:bg-blue-50/40">
                  <td className="px-2 py-2.5 font-bold text-slate-400">{index + 1}</td>
                  <td className="px-2 py-2.5 font-bold text-slate-700">#{scan.id}</td>
                  <td className="px-2 py-2.5"><img src={scan.image} alt="Scan thumbnail" className="h-8 w-10 rounded object-cover" /></td>
                  <td className="px-2 py-2.5"><StatusPill result={scan.result} /></td>
                  <td className="px-2 py-2.5 font-bold text-slate-700">{scan.confidence}</td>
                  <td className="px-2 py-2.5">{scan.generator}</td>
                  <td className="px-2 py-2.5 font-bold text-slate-700">{scan.trustScore}/100</td>
                  <td className="px-2 py-2.5 whitespace-nowrap">{scan.date}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex gap-2 text-slate-500">
                      <Link to="/dashboard/detection" aria-label="View scan" className="hover:text-blue-600"><Eye size={14} /></Link>
                      <Link to="/dashboard/reports" aria-label="Download report" className="hover:text-blue-600"><Download size={14} /></Link>
                      <button aria-label="More actions" className="hover:text-blue-600"><MoreVertical size={14} /></button>
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

export const Route = createFileRoute("/dashboard/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Scan History — SignalScope" },
      { name: "description", content: "Review all past image authenticity checks." },
      { property: "og:title", content: "Scan History — SignalScope" },
      { property: "og:description", content: "Review all past image authenticity checks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
