interface DayRate {
  date: string;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

const weights = [
  { label: "1 Gram", grams: 1 },
  { label: "8 Grams", sub: "1 Pavan", grams: 8 },
  { label: "10 Grams", grams: 10 },
  { label: "100 Grams", grams: 100 },
];

function fmt(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function TodayVsYesterday({
  today,
  yesterday,
}: {
  today: DayRate;
  yesterday: DayRate | null;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-lg shadow-amber-100/40">
      <div className="border-b border-zinc-100 bg-gradient-to-br from-white to-amber-50/30 px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 ring-1 ring-inset ring-amber-300/60">
            22K
          </span>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            Today vs. Yesterday
          </h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Price comparison across common weights
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Weight
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Today
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Yesterday
              </th>
              <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {weights.map((w) => {
              const todayPrice = today.rate_22k_1g * w.grams;
              const yesterdayPrice = yesterday
                ? yesterday.rate_22k_1g * w.grams
                : null;
              const change =
                yesterdayPrice !== null ? todayPrice - yesterdayPrice : null;

              return (
                <tr
                  key={w.grams}
                  className="border-b border-zinc-50 transition-colors hover:bg-amber-50/30 last:border-0"
                >
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-zinc-900">{w.label}</p>
                    {w.sub && (
                      <p className="text-[11px] text-zinc-400">{w.sub}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="font-bold text-zinc-900">
                      {fmt(todayPrice)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-zinc-500">
                    {yesterdayPrice !== null ? fmt(yesterdayPrice) : "—"}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {change !== null ? (
                      <ChangeCell change={change} />
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChangeCell({ change }: { change: number }) {
  if (change === 0) {
    return <span className="text-xs font-semibold text-zinc-400">—</span>;
  }
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-bold ${
        up ? "text-red-600" : "text-green-600"
      }`}
    >
      {up ? "\u25B2" : "\u25BC"} {up ? "+" : ""}
      {new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(change)}
    </span>
  );
}
