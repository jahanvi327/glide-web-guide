import { createFileRoute } from "@tanstack/react-router";
import { Radar } from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';
import { UploadPanel } from '@/components/upload-panel';

function AttributionPage() {
  const { scan } = useAnalysis();

  return (
    <>
      <div className="mb-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Open-set attribution</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Generator Attribution</h1>
        <p className="mt-1 text-[12px] text-slate-500">Identify the likely AI generator family, including unknown future generators.</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[265px_minmax(420px,1fr)]">
        <UploadPanel />

        <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Radar size={18} className="text-violet-600" />
            <h2 className="text-[14px] font-extrabold text-slate-800">Likely Generator Family</h2>
          </div>
          <p className="mb-4 text-[10px] text-slate-500">Open-set model calibration includes unknown future generators.</p>
          <div className="space-y-4">
            {scan.attributions.map((attr) => (
              <div key={attr.label}>
                <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-600">
                  <span>{attr.label}</span>
                  <span>{attr.probability}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${attr.barClass} transition-all duration-500`} style={{ width: `${attr.probability}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-emerald-50 p-3 text-[11px] text-emerald-700">
            <p className="font-bold">Unknown generator detection: active</p>
            <p className="mt-1 leading-4">The model can flag synthetic media it has never seen before, future-proofing against new generators.</p>
          </div>
        </section>
      </div>

      <section className="card-shadow mt-3 rounded-xl border border-slate-200/80 bg-white p-4">
        <h2 className="mb-3 text-[14px] font-extrabold text-slate-800">Confidence Calibration</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Stable Diffusion', desc: 'Diffusion-based, high-frequency artifacts', color: 'bg-blue-50 text-blue-600' },
            { label: 'Midjourney', desc: 'Stylized, painterly textures', color: 'bg-cyan-50 text-cyan-600' },
            { label: 'DALL·E', desc: 'Smooth blends, geometric issues', color: 'bg-amber-50 text-amber-600' },
            { label: 'Flux', desc: 'High realism, subtle artifacts', color: 'bg-violet-50 text-violet-600' },
            { label: 'GAN', desc: 'Fast generation, texture repetition', color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Unknown', desc: 'Unseen generator detected', color: 'bg-slate-100 text-slate-500' },
          ].map((g) => (
            <div key={g.label} className="rounded-lg border border-slate-100 p-3">
              <div className={`mb-2 grid h-8 w-8 place-items-center rounded-full ${g.color}`}><Radar size={15} /></div>
              <p className="text-[11px] font-bold text-slate-800">{g.label}</p>
              <p className="mt-1 text-[9px] leading-4 text-slate-500">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/dashboard/attribution")({
  component: AttributionPage,
  head: () => ({
    meta: [
      { title: "Generator Attribution — SignalScope" },
      { name: "description", content: "Identify the likely AI generator family behind an image." },
      { property: "og:title", content: "Generator Attribution — SignalScope" },
      { property: "og:description", content: "Identify the likely AI generator family behind an image." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
