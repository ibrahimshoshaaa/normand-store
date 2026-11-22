// Normand — admin loading skeleton (shown while a dashboard page loads).
export default function AdminLoading() {
  return (
    <div aria-label="Loading">
      <div className="h-9 w-56 animate-pulse rounded-full bg-surface" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[24px] bg-surface" />
        ))}
      </div>
      <div className="mt-4 h-64 animate-pulse rounded-[24px] bg-surface" />
    </div>
  );
}
