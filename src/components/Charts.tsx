// Normand — lightweight SVG charts (no chart library needed).
import type { DailyPoint } from "@/lib/demo";
import { formatMoney } from "@/lib/format";

export function RevenueChart({
  series,
  metric,
}: {
  series: DailyPoint[];
  metric: "revenue" | "orders";
}) {
  const values = series.map((p) => (metric === "revenue" ? p.revenue : p.orders));
  const max = Math.max(...values, 1);
  const W = 640;
  const H = 220;
  const PAD = 8;
  const points = values.map((v, i) => {
    const x = PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - (v / max) * (H - PAD * 2);
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${(W - PAD).toFixed(1)},${H - PAD} L${PAD},${H - PAD} Z`;
  const total = values.reduce((s, v) => s + v, 0);
  return (
    <div>
      <p className="text-sm text-ink-soft">
        {metric === "revenue" ? "Revenue" : "Orders"} · last 30 days —{" "}
        <strong className="text-ink">
          {metric === "revenue" ? formatMoney(Math.round(total * 100)) : `${total} in total`}
        </strong>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={`${metric} chart for the last 30 days`}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PAD} x2={W - PAD} y1={H * f} y2={H * f} stroke="#000" strokeOpacity="0.06" />
        ))}
        <path d={area} fill="url(#revFill)" />
        <path d={line} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        {points.map(([x, y], i) =>
          i % 5 === 0 ? <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" /> : null,
        )}
      </svg>
      <div className="flex justify-between text-xs text-ink-soft">
        <span>{series[0]?.label}</span>
        <span>{series[Math.floor(series.length / 2)]?.label}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export function CategoryDonut({
  data,
}: {
  data: Array<{ name: string; revenue: number; share: number; tint: string }>;
}) {
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const total = data.reduce((s, d) => s + d.revenue, 0);
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="h-44 w-44 shrink-0" role="img" aria-label="Sales by category">
        <circle cx="90" cy="90" r={R} fill="none" stroke="#f3efe6" strokeWidth="22" />
        {data.map((d) => {
          const len = d.share * C;
          const el = (
            <circle
              key={d.name}
              cx="90"
              cy="90"
              r={R}
              fill="none"
              stroke={d.tint}
              strokeWidth="22"
              strokeDasharray={`${Math.max(len - 2, 0)} ${C - Math.max(len - 2, 0)}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
            />
          );
          offset += len;
          return el;
        })}
        <text x="90" y="86" textAnchor="middle" className="font-display" fontSize="20" fontWeight="800" fill="#211d18">
          {formatMoney(Math.round(total * 100))}
        </text>
        <text x="90" y="106" textAnchor="middle" fontSize="11" fill="#6b6259">
          total sales
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: d.tint }} />
            <span className="flex-1">{d.name}</span>
            <strong>{Math.round(d.share * 100)}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
