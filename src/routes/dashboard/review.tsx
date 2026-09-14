import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, ListChecks, RotateCw } from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';
import { StatusPill } from '@/components/status-pill';

function ReviewPage() {
  const { history, reviewQueueCount } = useAnalysis();
  const pending = history.filter((h) => parseInt(h.confidence) < 80);
  const verified = history.filter((h) => parseInt(h.confidence) >= 80);

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Human-in-the-loop</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Review Queue</h1>
        <p className="mt-1 text-[12px] text-slate-500">Low-confidence predictions flagged for expert human review and retraining.</p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-50 text-amber-600"><Clock3 size={18} /></div>
          <div><p className="text-[11px] font-semibold text-slate-500">Pending Reviews</p><p className="text-xl font-extrabold text-slate-900">{pending.length}</p></div>
        </div>
        <div className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={18} /></div>
          <div><p className="text-[11px] font-semibold text-slate-500">Verified Cases</p><p className="text-xl font-extrabold text-slate-900">{verified.length}</p></div>
        </div>
        <div className="card-shadow flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-600"><RotateCw size={18} /></div>
          <div><p className="text-[11px] font-semibold text-slate-500">Retraining Candidates</p><p className="text-xl font-extrabold text-slate-900">{reviewQueueCount}</p></div>
        </div>
      </div>

      <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <ListChecks size={18} className="text-blue-600" />
          <h2 className="text-[14px] font-extrabold text-slate-800">Pending Review Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Prediction</th>
                <th className="px-2 py-2">Confidence</th>
                <th className="px-2 py-2">Generator</th>
                <th className="px-2 py-2">Trust Score</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-[11px] text-slate-500">No pending reviews. All predictions are high-confidence.</td></tr>
              ) : (
                pending.map((scan, index) => (
                  <tr key={scan.id} className="border-b border-slate-100 text-[10px] text-slate-600 transition hover:bg-blue-50/40">
                    <td className="px-2 py-2.5 font-bold text-slate-400">{index + 1}</td>
                    <td className="px-2 py-2.5"><img src={scan.image} alt="Scan thumbnail" className="h-8 w-10 rounded object-cover" /></td>
                    <td className="px-2 py-2.5"><StatusPill result={scan.result} /></td>
                    <td className="px-2 py-2.5 font-bold text-slate-700">{scan.confidence}</td>
                    <td className="px-2 py-2.5">{scan.generator}</td>
                    <td className="px-2 py-2.5 font-bold text-slate-700">{scan.trustScore}/100</td>
                    <td className="px-2 py-2.5"><span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-600">Pending</span></td>
                    <td className="px-2 py-2.5"><button className="rounded-md bg-blue-600 px-2 py-1 text-[9px] font-bold text-white hover:bg-blue-700">Verify</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-shadow mt-3 rounded-xl border border-slate-200/80 bg-white p-4">
        <h2 className="mb-3 text-[14px] font-extrabold text-slate-800">Active Learning Pipeline</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-bold text-slate-500">Step 1: Low-confidence capture</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-600">Predictions below 80% confidence are automatically stored for review.</p>
          </div>
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-bold text-slate-500">Step 2: Expert verification</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-600">Human experts verify the correct label for each flagged image.</p>
          </div>
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-bold text-slate-500">Step 3: Retraining dataset</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-600">Verified images are added to the retraining dataset to improve the model.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/dashboard/review")({
  component: ReviewPage,
  head: () => ({
    meta: [
      { title: "Review Queue — SignalScope" },
      { name: "description", content: "Low-confidence scans awaiting human review." },
      { property: "og:title", content: "Review Queue — SignalScope" },
      { property: "og:description", content: "Low-confidence scans awaiting human review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
