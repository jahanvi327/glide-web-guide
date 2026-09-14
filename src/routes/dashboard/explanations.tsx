import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Lightbulb, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAnalysis } from '@/lib/analysis-context';
import { UploadPanel } from '@/components/upload-panel';

const colorMap: Record<string, string> = {
  red: 'bg-rose-50 text-rose-500',
  orange: 'bg-orange-50 text-orange-500',
  amber: 'bg-amber-50 text-amber-500',
  blue: 'bg-blue-50 text-blue-500',
  slate: 'bg-slate-100 text-slate-500',
};

const textColorMap: Record<string, string> = {
  red: 'text-rose-500',
  orange: 'text-orange-500',
  amber: 'text-amber-500',
  blue: 'text-blue-500',
  slate: 'text-slate-500',
};

function ExplanationsPage() {
  const { scan, imageUrl } = useAnalysis();

  const heatmapGradient = scan.heatmapPoints
    .map((p) => `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.color}, transparent 21%)`)
    .join(', ');

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Explainable AI</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">AI Explanations</h1>
        <p className="mt-1 text-[12px] text-slate-500">Understand exactly why the model classified this image as {scan.verdict}.</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[265px_minmax(420px,1fr)]">
        <UploadPanel />

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
          <h2 className="mb-3 text-[14px] font-extrabold text-slate-800">Why this image is likely {scan.verdict === 'Real' ? 'real' : 'AI-generated'}?</h2>
          <div className="space-y-3">
            {scan.insights.map((item) => (
              <div key={item.title} className="flex gap-2.5">
                <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${colorMap[item.color]}`}>
                  <Sparkles size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-bold text-slate-700">{item.title}</p>
                    <span className={`text-[11px] font-bold ${textColorMap[item.color]}`}>{item.weight}%</span>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card-shadow mt-3 rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-extrabold text-slate-800">Grad-CAM Heatmap &amp; Attention Map</h2>
          <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600">View Full Image <ArrowUpRight size={11} /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <img src={imageUrl} alt="Original" className="h-[180px] w-full rounded-md object-cover" />
            <p className="mt-1 text-center text-[10px] font-semibold text-slate-500">Original Image</p>
          </div>
          <div className="relative overflow-hidden rounded-md">
            <img src={imageUrl} alt="Heatmap" className="h-[180px] w-full object-cover saturate-200" />
            <div className="absolute inset-0 mix-blend-screen" style={{ background: `${heatmapGradient}, linear-gradient(135deg, rgba(30,64,175,.45), rgba(220,38,38,.2))` }} />
            <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-semibold text-white">Suspicious Regions (Grad-CAM)</p>
          </div>
          <div className="relative overflow-hidden rounded-md">
            <img src={imageUrl} alt="Attention map" className="h-[180px] w-full object-cover contrast-125" />
            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay" />
            <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-semibold text-white">Attention Map</p>
          </div>
        </div>
      </section>

      <section className="card-shadow mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="mb-2 flex items-center gap-2 text-blue-600">
          <Lightbulb size={16} />
          <p className="text-[12px] font-extrabold">Quick Insights</p>
        </div>
        <ul className="space-y-2 pl-4 text-[11px] leading-5 text-slate-600">
          {scan.quickInsights.map((insight, i) => (
            <li key={i} className="list-disc">{insight}</li>
          ))}
        </ul>
        <Link to="/dashboard/detection" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800">
          Back to detection <ArrowUpRight size={12} />
        </Link>
      </section>
    </>
  );
}

export const Route = createFileRoute("/dashboard/explanations")({
  component: ExplanationsPage,
  head: () => ({
    meta: [
      { title: "AI Explanations — SignalScope" },
      { name: "description", content: "Understand why an image was flagged as AI generated." },
      { property: "og:title", content: "AI Explanations — SignalScope" },
      { property: "og:description", content: "Understand why an image was flagged as AI generated." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
