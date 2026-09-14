export function StatusPill({ result }: { result: string }) {
  const real = result === 'Real';
  const unknown = result === 'Unknown AI Generator';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
        real ? 'bg-emerald-50 text-emerald-600' : unknown ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${real ? 'bg-emerald-500' : unknown ? 'bg-amber-500' : 'bg-rose-500'}`} />
      {result}
    </span>
  );
}
