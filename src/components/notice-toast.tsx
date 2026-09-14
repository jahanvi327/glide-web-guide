import { CheckCircle2, X } from 'lucide-react';
import { useAnalysis } from '@/lib/analysis-context';

export function NoticeToast() {
  const { notice, clearNotice } = useAnalysis();
  if (!notice) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-[340px] items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-[11px] font-semibold text-white soft-shadow animate-slide-in-right dark:bg-slate-800 dark:border dark:border-slate-600">
      <CheckCircle2 size={16} className="text-emerald-400 animate-pulse" />
      {notice}
      <button onClick={clearNotice} className="ml-auto text-slate-400 transition-colors duration-200 hover:text-white">
        <X size={15} />
      </button>
    </div>
  );
}
