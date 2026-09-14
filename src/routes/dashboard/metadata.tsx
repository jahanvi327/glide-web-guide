import { createFileRoute } from "@tanstack/react-router";
import { FileBadge2, FileSearch2, ShieldCheck } from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';
import { UploadPanel } from '@/components/upload-panel';

function MetadataPage() {
  const { scan } = useAnalysis();

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Provenance</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Metadata Analysis</h1>
        <p className="mt-1 text-[12px] text-slate-500">Inspect EXIF data, C2PA content credentials, and device information.</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[265px_minmax(420px,1fr)]">
        <UploadPanel />

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileSearch2 size={18} className="text-emerald-600" />
            <h2 className="text-[14px] font-extrabold text-slate-800">Trust &amp; Metadata Signals</h2>
          </div>
          <div className="space-y-3">
            {scan.metadata.map((entry) => (
              <div key={entry.label} className="flex items-center justify-between border-b border-slate-100 pb-3 text-[11px]">
                <span className="font-semibold text-slate-500">{entry.label}</span>
                <span className={`font-bold ${entry.tone}`}>{entry.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-blue-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800">Metadata Trust Score</p>
              <p className="text-[10px] text-slate-500">Composite score from EXIF, C2PA, and device signals</p>
            </div>
            <p className={`ml-auto text-2xl font-extrabold ${scan.trustScore >= 70 ? 'text-emerald-600' : scan.trustScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{scan.trustScore}<span className="text-sm text-slate-400">/100</span></p>
          </div>
        </section>
      </div>

      <section className="card-shadow mt-3 rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <FileBadge2 size={16} className="text-blue-600" />
          <h2 className="text-[14px] font-extrabold text-slate-800">C2PA Content Credentials</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-bold text-slate-500">Content Credentials Status</p>
            <p className={`mt-1 text-[12px] font-extrabold ${scan.verdict === 'Real' ? 'text-emerald-600' : 'text-orange-500'}`}>
              {scan.verdict === 'Real' ? 'Verified' : 'Not found'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-bold text-slate-500">Provenance Chain</p>
            <p className="mt-1 text-[12px] font-extrabold text-slate-700">{scan.verdict === 'Real' ? 'Complete' : 'Broken / missing'}</p>
          </div>
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-bold text-slate-500">Creator Verified</p>
            <p className={`mt-1 text-[12px] font-extrabold ${scan.verdict === 'Real' ? 'text-emerald-600' : 'text-slate-500'}`}>
              {scan.verdict === 'Real' ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-[10px] font-bold text-slate-500">Edit History</p>
            <p className="mt-1 text-[12px] font-extrabold text-slate-700">{scan.verdict === 'Real' ? 'No edits detected' : 'Suspicious'}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/dashboard/metadata")({
  component: MetadataPage,
  head: () => ({
    meta: [
      { title: "Metadata Analysis — SignalScope" },
      { name: "description", content: "Inspect EXIF and C2PA content credentials." },
      { property: "og:title", content: "Metadata Analysis — SignalScope" },
      { property: "og:description", content: "Inspect EXIF and C2PA content credentials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
