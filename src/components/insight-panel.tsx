import { useState } from 'react';
import { ArrowUpRight, Lightbulb, Sparkles } from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';

const colorMap: Record<string, string> = {
  red: 'bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400',
  orange: 'bg-orange-50 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400',
  amber: 'bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400',
  blue: 'bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400',
  slate: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
};

const textColorMap: Record<string, string> = {
  red: 'text-rose-500 dark:text-rose-400',
  orange: 'text-orange-500 dark:text-orange-400',
  amber: 'text-amber-500 dark:text-amber-400',
  blue: 'text-blue-500 dark:text-blue-400',
  slate: 'text-slate-500 dark:text-slate-400',
};

export function InsightPanel() {
  const { scan, imageUrl } = useAnalysis();
  const [selectedTab, setSelectedTab] = useState<'AI Explanation' | 'Metadata' | 'Generator Attribution'>('AI Explanation');

  const heatmapGradient = scan.heatmapPoints
    .map((p) => `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.color}, transparent 21%)`)
    .join(', ');

  return (
    <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-3 dark:bg-slate-900 dark:border-slate-700">
      <div className="mb-3 flex rounded-lg bg-slate-50 p-1 dark:bg-slate-800">
        {(['AI Explanation', 'Metadata', 'Generator Attribution'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 rounded-md py-2 text-[9px] font-bold transition-all duration-200 ${
              selectedTab === tab ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === 'AI Explanation' && (
        <div key={scan.scanId} className="animate-fade-in">
          <p className="mb-3 text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
            Why this image is likely {scan.verdict === 'Real' ? 'real' : 'AI-generated'}?
          </p>
          <div className="stagger space-y-3">
            {scan.insights.map((item) => (
              <div key={item.title} className="flex gap-2.5 hover-lift">
                <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${colorMap[item.color]}`}>
                  <Sparkles size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{item.title}</p>
                    <span className={`text-[10px] font-bold ${textColorMap[item.color]}`}>{item.weight}%</span>
                  </div>
                  <p className="mt-0.5 text-[9px] leading-4 text-slate-500 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Heatmap Visualization</p>
              <button className="flex items-center gap-1 text-[9px] font-bold text-blue-600 dark:text-blue-400">View Full Image <ArrowUpRight size={11} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <img src={imageUrl} alt="Original scan" className="h-[86px] w-full rounded-md object-cover" />
                <p className="mt-1 text-center text-[8px] font-semibold text-slate-500 dark:text-slate-400">Original Image</p>
              </div>
              <div className="relative overflow-hidden rounded-md">
                <img src={imageUrl} alt="Suspicious regions heatmap" className="h-[86px] w-full object-cover saturate-200" />
                <div
                  className="absolute inset-0 mix-blend-screen"
                  style={{ background: `${heatmapGradient}, linear-gradient(135deg, rgba(30,64,175,.45), rgba(220,38,38,.2))` }}
                />
                <p className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-semibold text-white">Suspicious Regions (Heatmap)</p>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/50 dark:bg-blue-900/20">
            <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Lightbulb size={15} />
              <p className="text-[10px] font-extrabold">Quick Insights</p>
            </div>
            <ul className="space-y-1.5 pl-3 text-[9px] leading-4 text-slate-600 dark:text-slate-400">
              {scan.quickInsights.map((insight, i) => (
                <li key={i} className="list-disc">{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedTab === 'Metadata' && (
        <div key={scan.scanId} className="animate-fade-in space-y-3">
          <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Trust &amp; metadata signals</p>
          {scan.metadata.map((entry) => (
            <div key={entry.label} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 text-[10px]">
              <span className="font-semibold text-slate-500 dark:text-slate-400">{entry.label}</span>
              <span className={`font-bold ${entry.tone}`}>{entry.value}</span>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'Generator Attribution' && (
        <div key={scan.scanId} className="animate-fade-in space-y-4">
          <div>
            <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Likely generator family</p>
            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Open-set model calibration includes unknown future generators.</p>
          </div>
          {scan.attributions.map((attr) => (
            <div key={attr.label}>
              <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                <span>{attr.label}</span>
                <span>{attr.probability}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div className={`h-full rounded-full ${attr.barClass} transition-all duration-700 ease-out`} style={{ width: `${attr.probability}%` }} />
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-emerald-50 p-3 text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <p className="font-bold">Unknown generator detection: active</p>
            <p className="mt-1 leading-4">The model can flag synthetic media it has never seen before.</p>
          </div>
        </div>
      )}
    </section>
  );
}
