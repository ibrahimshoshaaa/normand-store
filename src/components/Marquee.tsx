// Normand — scrolling marquee strip.
const ITEMS = [
  "Made in Portugal",
  "Small batches",
  "Free delivery over $150",
  "Washed linen",
  "Made to last",
  "Dispatched in 48 hours",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden rounded-full border border-black/10 bg-surface py-2.5" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-6 whitespace-nowrap">
        {[0, 1].map((half) => (
          <span key={half} className="flex items-center gap-6">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-6 text-sm font-medium">
                {item}
                <span className="text-accent">✳</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
