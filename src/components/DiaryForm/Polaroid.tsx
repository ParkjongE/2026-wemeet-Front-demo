const TILT_ANGLES = [-4, 3, -3, 5, -5, 2];

interface PolaroidProps {
  src: string;
  alt: string;
  index: number;
}

export default function Polaroid({ src, alt, index }: PolaroidProps) {
  const angle = TILT_ANGLES[index % TILT_ANGLES.length];

  return (
    <div
      className="relative rounded-sm bg-white p-2 pb-4 shadow-md transition-transform hover:z-10 hover:scale-105 hover:rotate-0"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <span
        className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-2 bg-yellow-light/90 shadow-sm"
        aria-hidden="true"
      />
      <img src={src} alt={alt} className="aspect-square w-full rounded-xs object-cover" />
    </div>
  );
}
