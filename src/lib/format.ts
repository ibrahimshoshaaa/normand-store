// Amounts are stored in piasters (1 EGP = 100 piasters) and rendered as
// "EGP 1,150" — no decimals for whole pounds, two decimals otherwise.
export function formatMoney(cents: number): string {
  const pounds = cents / 100;
  const formatted = Number.isInteger(pounds)
    ? pounds.toLocaleString("en-US")
    : pounds.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `EGP ${formatted}`;
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const mins = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
