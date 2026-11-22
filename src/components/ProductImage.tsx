// Normand — product visuals.
// Self-contained inline SVG garment silhouettes on a pastel tile.
// No external images, so the store renders identically offline and on Vercel.
// Swap `garment` artwork for real photos later by replacing this component.

type Garment = "tee" | "hoodie" | "coat" | "dress" | "crew" | "jeans" | "trousers";

const PATHS: Record<Garment, string> = {
  // t-shirt
  tee: "M62 52 L38 64 L52 96 L66 88 L66 152 L134 152 L134 88 L148 96 L162 64 L138 52 Q120 62 100 62 Q80 62 62 52 Z",
  // hoodie
  hoodie:
    "M100 34 Q78 34 76 58 L60 66 L48 104 L64 110 L66 150 Q66 158 74 158 L126 158 Q134 158 134 150 L136 110 L152 104 L140 66 L124 58 Q122 34 100 34 Z M84 118 L116 118 L116 148 L84 148 Z",
  // long wool coat
  coat: "M74 44 L56 54 L48 96 L62 100 L64 168 Q64 176 72 176 L128 176 Q136 176 136 168 L138 100 L152 96 L144 54 L126 44 Q114 54 100 54 Q86 54 74 44 Z M100 54 L100 176",
  // linen dress
  dress:
    "M78 40 L70 52 L58 92 L72 96 L66 168 Q66 176 74 176 L126 176 Q134 176 134 168 L128 96 L142 92 L130 52 L122 40 Q112 48 100 48 Q88 48 78 40 Z",
  // crew sweatshirt
  crew: "M66 48 L40 62 L52 106 L66 100 L66 152 L134 152 L134 100 L148 106 L160 62 L134 48 Q118 58 100 58 Q82 58 66 48 Z",
  // jeans
  jeans:
    "M68 40 L132 40 L138 76 L128 168 Q127 176 120 176 L110 176 Q104 176 103 170 L100 96 L97 170 Q96 176 90 176 L80 176 Q73 176 72 168 L62 76 Z M68 52 L132 52",
  // tailored trouser
  trousers:
    "M70 40 L130 40 L136 78 L126 172 Q125 178 119 178 L109 178 Q104 178 103 172 L100 92 L97 172 Q96 178 91 178 L81 178 Q75 178 74 172 L64 78 Z M70 52 L130 52",
};

export function ProductImage({
  garment,
  bg,
  ink = "#211d18",
  className = "",
  label,
}: {
  garment: string;
  bg: string;
  ink?: string;
  className?: string;
  label?: string;
}) {
  const key = (Object.keys(PATHS) as Garment[]).includes(garment as Garment)
    ? (garment as Garment)
    : "tee";
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={label ?? "Product image"}
      className={className}
      style={{ background: bg }}
    >
      <ellipse cx="100" cy="168" rx="52" ry="8" fill="#000" opacity="0.08" />
      <path d={PATHS[key]} fill={ink} opacity="0.88" />
      <path d={PATHS[key]} fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />
    </svg>
  );
}
