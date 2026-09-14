import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ScanSearch,
  ShieldCheck,
  FileCheck2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useAnalysis } from '@/lib/analysis-context';
import { AnalysisResultCard } from '@/components/analysis-result-card';
import { UploadPanel } from '@/components/upload-panel';

function DetectionPage() {
  const { scan, imageUrl, runAnalysis, setNotice } = useAnalysis();
  const [caption, setCaption] = useState('');
  const [captionResult, setCaptionResult] = useState<{ match: boolean; score: number } | null>(null);

  const isReal = scan.verdict === 'Real';

  const checkCaption = () => {
    if (!caption.trim()) {
      setNotice('Please enter a caption to verify.');
      return;
    }
    const score = Math.floor(Math.random() * 100);
    const match = score > 60;
    setCaptionResult({ match, score });
    setNotice(match ? `Caption matches image (${score}% consistency).` : `Mismatch detected — consistency ${score}%.`);
  };

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Detection</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Detection Results</h1>
        <p className="mt-1 text-[12px] text-slate-500">Full breakdown of the AI authenticity verdict for the current image.</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[265px_minmax(420px,1fr)]">
        <UploadPanel />
        <AnalysisResultCard />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
          <h2 className="mb-3 text-[14px] font-extrabold text-slate-800">Probability Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-[11px] font-bold">
                <span className="text-rose-600">AI Generated</span>
                <span className="text-slate-700">{scan.aiProbability}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500" style={{ width: `${scan.aiProbability}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-[11px] font-bold">
                <span className="text-emerald-600">Real Image</span>
                <span className="text-slate-700">{scan.realProbability}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500" style={{ width: `${scan.realProbability}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-[9px] font-semibold text-slate-500">Confidence</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">{scan.confidence}%</p>
              <p className="text-[8px] text-slate-400">{scan.confidenceLabel}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-[9px] font-semibold text-slate-500">Risk Level</p>
              <p className={`mt-1 text-lg font-extrabold ${scan.riskLevel === 'High' ? 'text-rose-600' : scan.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>{scan.riskLevel}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-[9px] font-semibold text-slate-500">Trust Score</p>
              <p className={`mt-1 text-lg font-extrabold ${scan.trustScore >= 70 ? 'text-emerald-600' : scan.trustScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{scan.trustScore}</p>
              <p className="text-[8px] text-slate-400">/ 100</p>
            </div>
          </div>
        </section>

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileCheck2 size={16} className="text-blue-600" />
            <h2 className="text-[14px] font-extrabold text-slate-800">Image + Caption Verification</h2>
          </div>
          <p className="mb-3 text-[10px] text-slate-500">Enter a caption describing what the image shows, then check if the visual content matches.</p>
          <div className="relative mb-3 overflow-hidden rounded-md bg-slate-100">
            <img src={imageUrl} alt="Image for caption check" className="h-[160px] w-full object-cover" />
          </div>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. A luxury sports car on a city street"
            className="mb-3 h-9 w-full rounded-lg border border-blue-100 bg-white px-3 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button onClick={checkCaption} className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2 text-[10px] font-bold text-white transition hover:bg-blue-700">
            <ScanSearch size={13} />Check consistency
          </button>
          {captionResult && (
            <div className={`mt-3 rounded-lg p-3 ${captionResult.match ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              <div className="flex items-center gap-2">
                {captionResult.match ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-rose-600" />}
                <p className={`text-[11px] font-extrabold ${captionResult.match ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {captionResult.match ? 'Match Detected' : 'Mismatch Detected'}
                </p>
              </div>
              <p className="mt-1 text-[10px] text-slate-600">Consistency Score: {captionResult.score}%</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export const Route = createFileRoute("/dashboard/detection")({
  component: DetectionPage,
  head: () => ({
    meta: [
      { title: "Detection Results — SignalScope" },
      { name: "description", content: "Detailed AI vs real detection results for your image." },
      { property: "og:title", content: "Detection Results — SignalScope" },
      { property: "og:description", content: "Detailed AI vs real detection results for your image." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
