import { MOODS, STICKERS } from "./stickerData";

export function Sticker({ kind, className = "" }: { kind: string; className?: string }) {
  const def = STICKERS[kind];
  if (!def) return null;
  return <span className={`block drop-shadow-[0_2px_2px_rgba(63,56,51,0.18)] ${className}`}>{def.render()}</span>;
}

export function MoodFace({ tag, className = "" }: { tag: string; className?: string }) {
  const mood = MOODS.find((m) => m.tag === tag);
  if (!mood) return null;
  const ink = "#4a3d35";
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="21" fill={mood.color} stroke="#fff" strokeWidth="3" />
      {mood.eyes === "dot" && (
        <>
          <circle cx="17" cy="21" r="2.3" fill={ink} />
          <circle cx="31" cy="21" r="2.3" fill={ink} />
        </>
      )}
      {mood.eyes === "smile" && (
        <g stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M14 22c1.5-2.5 4.5-2.5 6 0" />
          <path d="M28 22c1.5-2.5 4.5-2.5 6 0" />
        </g>
      )}
      {mood.eyes === "sleepy" && (
        <g stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M14 21c1.5 2 4.5 2 6 0" />
          <path d="M28 21c1.5 2 4.5 2 6 0" />
        </g>
      )}
      {mood.eyes === "sparkle" && (
        <g fill={ink}>
          <path d="M17 17l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" />
          <path d="M31 17l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" />
        </g>
      )}
      {mood.mouth === "smile" && (
        <path d="M18 29c3 3.5 9 3.5 12 0" stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
      {mood.mouth === "big" && <path d="M17 28h14c-1 5-4 7-7 7s-6-2-7-7Z" fill={ink} />}
      {mood.mouth === "flat" && (
        <path d="M20 31h8" stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
      {mood.mouth === "sad" && (
        <path d="M18 33c3-3.5 9-3.5 12 0" stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
      {mood.extra === "blush" && (
        <>
          <ellipse cx="12" cy="28" rx="3.2" ry="2.2" fill="#f08a6c" opacity=".45" />
          <ellipse cx="36" cy="28" rx="3.2" ry="2.2" fill="#f08a6c" opacity=".45" />
        </>
      )}
      {mood.extra === "tear" && <path d="M34 25c1.5 2.5 2 4 0 5s-3-1-2-2.5Z" fill="#7db8d8" />}
      {mood.extra === "brow" && (
        <g stroke={ink} strokeWidth="2" strokeLinecap="round">
          <path d="M13 15l6 1.5" />
          <path d="M35 15l-6 1.5" />
        </g>
      )}
      {mood.extra === "zzz" && (
        <text x="35" y="13" fontSize="9" fontWeight="700" fill={ink} fontFamily="Gaegu, sans-serif">
          z
        </text>
      )}
    </svg>
  );
}
