// Normand — storefront loading skeleton (shown while a page loads).
export default function StoreLoading() {
  return (
    <div className="mx-auto w-[min(1200px,calc(100%-1.5rem))] pt-6" aria-label="Loading">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-64 animate-pulse rounded-[24px] bg-surface md:col-span-2" />
        <div className="h-64 animate-pulse rounded-[24px] bg-surface" />
      </div>
      <div className="mt-8 h-8 w-64 animate-pulse rounded-full bg-surface" />
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-square animate-pulse rounded-[24px] bg-surface" />
        ))}
      </div>
    </div>
  );
}
