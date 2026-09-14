import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ScanSearch } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAnalysis } from '@/lib/analysis-context';
import { UploadPanel } from '@/components/upload-panel';
import { AnalysisResultCard } from '@/components/analysis-result-card';
import { InsightPanel } from '@/components/insight-panel';

function UploadPage() {
  const { runAnalysis } = useAnalysis();

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Image Analysis</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Upload Image</h1>
        <p className="mt-1 text-[12px] text-slate-500">Drag &amp; drop, browse, or capture an image to analyze its authenticity.</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[265px_minmax(420px,1fr)_344px]">
        <UploadPanel />
        <AnalysisResultCard />
        <InsightPanel />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/dashboard/detection" className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-[11px] font-bold text-white transition hover:bg-blue-700">
          View detection details <ArrowUpRight size={14} />
        </Link>
        <button onClick={runAnalysis} className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-[11px] font-bold text-blue-600 transition hover:bg-blue-50">
          <ScanSearch size={14} />Run fresh analysis
        </button>
      </div>
    </>
  );
}

export const Route = createFileRoute("/dashboard/upload")({
  component: UploadPage,
  head: () => ({
    meta: [
      { title: "Upload Image — SignalScope" },
      { name: "description", content: "Drag, drop or capture an image to analyze its authenticity." },
      { property: "og:title", content: "Upload Image — SignalScope" },
      { property: "og:description", content: "Drag, drop or capture an image to analyze its authenticity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
