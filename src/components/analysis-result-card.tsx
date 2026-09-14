import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';

export function AnalysisResultCard() {
  const { scan, imageUrl, runAnalysis } = useAnalysis();
  const [scanning, setScanning] = useState(false);
  const isReal = scan.verdict === 'Real';
  const isUnknown = scan.verdict === 'Unknown AI Generator';
  const aiDeg = Math.round((scan.aiProbability / 100) * 360);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      runAnalysis();
      setScanning(false);
    }, 1200);
  };

  return (
    <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">Detection Result</h2>
        <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold transition-all duration-300 ${scanning ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
          {scanning ? <ScanSearch size={11} className="animate-spin-slow" /> : <CheckCircle2 size={11} />}
          {scanning ? 'Analyzing...' : 'Analysis Complete'}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(145px,1fr)_minmax(205px,1.4fr)]">
        <div className="relative h-[226px] overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
          <img src={imageUrl} alt="Image under analysis" className="h-full w-full object-cover" />
          {scanning && <div className="scan-overlay absolute inset-0" />}
          <div className="absolute bottom-2 left-2 rounded bg-slate-900/70 px-2 py-1 text-[9px] font-medium text-white">
            Scan ID #{scan.scanId}
          </div>
        </div>
        <div className={`rounded-md border bg-gradient-to-br p-3 animate-scale-in dark:bg-slate-800 ${isReal ? 'border-emerald-100 from-emerald-50/80 to-white dark:border-emerald-900/50 dark:from-emerald-900/20' : isUnknown ? 'border-amber-100 from-amber-50/80 to-white dark:border-amber-900/50 dark:from-amber-900/20' : 'border-rose-100 from-rose-50/80 to-white dark:border-rose-900/50 dark:from-rose-900/20'}`}>
          <div className={`flex items-center gap-2 border-b pb-3 dark:border-slate-700 ${isReal ? 'border-emerald-100 dark:border-emerald-900/50' : isUnknown ? 'border-amber-100 dark:border-amber-900/50' : 'border-rose-100 dark:border-rose-900/50'}`}>
            <div className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-300 ${isReal ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/40' : isUnknown ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/40' : 'bg-rose-100 text-rose-500 dark:bg-rose-900/40'}`}>
              {isReal ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
            </div>
            <p className={`text-[14px] font-extrabold ${isReal ? 'text-emerald-600 dark:text-emerald-400' : isUnknown ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>{scan.verdict}</p>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 py-3">
            <div>
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Confidence Score</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{scan.confidence}%</p>
            </div>
            <div
              className="relative grid h-14 w-14 place-items-center rounded-full transition-all duration-500"
              style={{ background: `conic-gradient(${isReal ? '#10b981' : '#ef3d55'} 0deg ${aiDeg}deg, #ffd3d9 ${aiDeg}deg 360deg)` }}
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {scan.confidenceLabel}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 py-2.5">
            <KeyRound size={16} className="text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400">Likely Generator</p>
              <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{scan.generator}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2.5">
            <ShieldCheck size={16} className="text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400">Risk Level</p>
              <span
                className={`mt-1 inline-flex rounded px-2 py-0.5 text-[9px] font-bold text-white ${
                  scan.riskLevel === 'High' ? 'bg-rose-500' : scan.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              >
                {scan.riskLevel}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleScan}
        disabled={scanning}
        className="group mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 py-2.5 text-[10px] font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 dark:bg-blue-600"
      >
        <ScanSearch size={14} className={`transition-transform duration-500 ${scanning ? 'animate-spin-slow' : 'group-hover:rotate-180'}`} />
        {scanning ? 'Analyzing image...' : 'Run fresh analysis'}
      </button>
    </section>
  );
}
