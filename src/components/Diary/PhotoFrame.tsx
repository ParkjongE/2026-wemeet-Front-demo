import type { ReactNode } from "react";
import type { PhotoFrame as FrameStyle } from "../../types";

const TILTS = [-3, 2.5, -2, 3.5, -4];
const TAPE_COLORS = ["#f2c6a0", "#a5dce8", "#f6d9cf", "#cfe3c5", "#f2d27a"];

interface PhotoFrameProps {
  src: string;
  alt: string;
  frame: FrameStyle;
  index: number;
  children?: ReactNode;
  tilt?: boolean;
  className?: string;
}

// 일기 속 사진 한 장. 폴라로이드, 마스킹테이프, 동그란 틀 중 하나로 보여준다.
export default function PhotoFrame({ src, alt, frame, index, children, tilt = true, className = "" }: PhotoFrameProps) {
  const angle = tilt ? TILTS[index % TILTS.length] : 0;
  const tape = TAPE_COLORS[index % TAPE_COLORS.length];

  if (frame === "round") {
    return (
      <div className={`relative ${className}`} style={{ transform: `rotate(${angle / 2}deg)` }}>
        <div className="relative aspect-square overflow-hidden rounded-full bg-white p-1.5 shadow-card ring-1 ring-black/5">
          <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" draggable={false} />
          {children}
        </div>
      </div>
    );
  }

  if (frame === "tape") {
    return (
      <div className={`relative ${className}`} style={{ transform: `rotate(${angle}deg)` }}>
        <div className="relative aspect-[4/3.4] overflow-hidden rounded-[3px] bg-white shadow-card">
          <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
          {children}
        </div>
        <span
          className="washi absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 opacity-90"
          style={{ backgroundColor: tape, transform: `translateX(-50%) rotate(${-angle * 1.5}deg)` }}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ transform: `rotate(${angle}deg)` }}>
      <div className="relative bg-white p-[6%] pb-[18%] shadow-card ring-1 ring-black/5">
        <div className="relative aspect-square overflow-hidden bg-sand-light">
          <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
          {children}
        </div>
      </div>
    </div>
  );
}
