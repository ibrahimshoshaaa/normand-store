import { listSubscribers } from "@/lib/store";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminSubscribers() {
  const subs = await listSubscribers();
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Subscribers</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {subs.length} {subs.length === 1 ? "subscriber" : "subscribers"} signed up for the
        monthly letter.
      </p>
      {subs.length === 0 ? (
        <p className="mt-6 rounded-[24px] bg-surface p-6 text-ink-soft">
          No subscribers yet — newsletter signups from the storefront show up here.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {subs.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[24px] bg-surface px-5 py-4"
            >
              <span className="font-semibold">{s.email}</span>
              <span className="text-sm text-ink-soft">{formatDateTime(s.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
