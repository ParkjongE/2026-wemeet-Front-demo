import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from "react";

// 책장 한 장. 앞면은 오른쪽 페이지, 뒷면은 넘긴 뒤 왼쪽에 보이는 페이지다.
export interface Leaf {
  front: ReactNode;
  back: ReactNode;
}

export interface PageFlipperHandle {
  next: () => void;
  prev: () => void;
  goTo: (flipped: number) => void;
}

interface PageFlipperProps {
  leaves: Leaf[];
  mode: "spread" | "single";
  pageWidth: number;
  pageHeight: number;
  flipped: number;
  onFlippedChange: (flipped: number) => void;
  ref?: Ref<PageFlipperHandle>;
  keyboard?: boolean;
}

const DURATION_MS = 760;
const DRAG_START_PX = 6;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface Motion {
  leaf: number;
  angle: number; // 0(오른쪽에 놓임) ~ -180(왼쪽으로 넘어감)
}

export default function PageFlipper({
  leaves,
  mode,
  pageWidth,
  pageHeight,
  flipped,
  onFlippedChange,
  ref,
  keyboard = true,
}: PageFlipperProps) {
  const total = leaves.length;
  const [motion, setMotion] = useState<Motion | null>(null);
  const frame = useRef<number | null>(null);
  const busy = useRef(false);
  const drag = useRef<{
    leaf: number;
    startX: number;
    startAngle: number;
    moved: boolean;
    side: "left" | "right";
  } | null>(null);
  const reduceMotion = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  const animate = useCallback(
    (leaf: number, from: number, to: number, done: () => void) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      busy.current = true;
      const duration = reduceMotion.current ? 1 : (DURATION_MS * Math.abs(to - from)) / 180;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / Math.max(duration, 1));
        setMotion({ leaf, angle: from + (to - from) * easeInOut(t) });
        if (t < 1) {
          frame.current = requestAnimationFrame(step);
        } else {
          frame.current = null;
          busy.current = false;
          done();
          setMotion(null);
        }
      };
      frame.current = requestAnimationFrame(step);
    },
    [],
  );

  const next = useCallback(() => {
    if (busy.current || flipped >= total) return;
    const leaf = flipped;
    animate(leaf, 0, -180, () => onFlippedChange(leaf + 1));
  }, [animate, flipped, onFlippedChange, total]);

  const prev = useCallback(() => {
    if (busy.current || flipped <= 0) return;
    const leaf = flipped - 1;
    animate(leaf, -180, 0, () => onFlippedChange(leaf));
  }, [animate, flipped, onFlippedChange]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      prev,
      goTo: (target: number) => {
        if (busy.current) return;
        onFlippedChange(Math.max(0, Math.min(total, target)));
      },
    }),
    [next, prev, onFlippedChange, total],
  );

  useEffect(() => {
    if (!keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboard, next, prev]);

  // ---------- 드래그로 넘기기 ----------
  const spread = mode === "spread";
  const bookWidth = spread ? pageWidth * 2 : pageWidth;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (busy.current || e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const side: "left" | "right" = spread ? (x < rect.width / 2 ? "left" : "right") : x < rect.width * 0.35 ? "left" : "right";
    drag.current = {
      leaf: side === "right" ? flipped : flipped - 1,
      startX: e.clientX,
      startAngle: side === "right" ? 0 : -180,
      moved: false,
      side,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) < DRAG_START_PX) return;
    if (d.leaf < 0 || d.leaf >= total) return;
    if (!d.moved) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const span = pageWidth * (spread ? 1.6 : 1.2);
    const angle = Math.max(-180, Math.min(0, d.startAngle + (dx / span) * 180));
    setMotion({ leaf: d.leaf, angle });
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      // 살짝 누르면 누른 쪽으로 넘긴다.
      if (d.side === "right") next();
      else prev();
      return;
    }
    if (d.leaf < 0 || d.leaf >= total || !motion) {
      setMotion(null);
      return;
    }
    const from = motion.angle;
    const forward = d.side === "right";
    const commit = forward ? from < -55 : from > -125;
    const target = commit ? (forward ? -180 : 0) : forward ? 0 : -180;
    const leaf = d.leaf;
    animate(leaf, from, target, () => {
      if (commit) onFlippedChange(forward ? leaf + 1 : leaf);
    });
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // 캡처하지 않은 포인터
    }
  };

  // 표지만 보일 때(덮인 책)는 가운데로, 뒤표지만 보일 때는 반대로 민다.
  const closedFront = spread && flipped === 0 && (!motion || motion.leaf === 0);
  const closedBack = spread && flipped === total && (!motion || motion.leaf === total - 1);
  const shift = closedFront && !motion ? -pageWidth / 2 : closedBack && !motion ? pageWidth / 2 : 0;

  return (
    <div
      className="book-stage relative mx-auto select-none"
      style={{ width: bookWidth, height: pageHeight, touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
        setMotion(null);
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.3,.7,.2,1)]"
        style={{ transform: `translateX(${shift}px)` }}
      >
        {/* 책 아래 그림자 */}
        {spread && !closedFront && !closedBack && (
          <div
            className="pointer-events-none absolute inset-x-[2%] -bottom-3 h-6 rounded-[50%] bg-brown/25 blur-xl"
            aria-hidden
          />
        )}
        {leaves.map((leaf, i) => {
          const isMoving = motion?.leaf === i;
          const angle = isMoving ? motion.angle : i < flipped ? -180 : 0;
          const z = isMoving ? total + 10 : i < flipped ? i + 1 : total - i;
          const progress = Math.abs(angle) / 180; // 0..1
          const lift = Math.sin(progress * Math.PI); // 넘기는 중간에 가장 크다
          // 단면 모드에서 넘어간 장은 숨긴다.
          const hidden = !spread && !isMoving && i < flipped;
          // 화면에 보일 일이 없는 장은 그리지 않는다(가까운 장만 렌더).
          const near = Math.abs(i - flipped) <= 2 || isMoving;
          if (!near) return null;
          return (
            <div
              key={i}
              className="book-leaf absolute top-0 h-full"
              style={{
                left: spread ? pageWidth : 0,
                width: pageWidth,
                transform: `rotateY(${angle}deg)`,
                zIndex: z,
                visibility: hidden ? "hidden" : undefined,
              }}
            >
              <div className="book-face absolute inset-0 overflow-hidden rounded-r-[6px] bg-paper">
                {leaf.front}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(to left, rgba(63,56,51,${0.28 * lift}) 0%, rgba(63,56,51,${0.08 * lift}) 40%, rgba(255,255,255,${0.12 * lift}) 100%)`,
                  }}
                />
              </div>
              <div className="book-face book-face-back absolute inset-0 overflow-hidden rounded-l-[6px] bg-paper">
                {leaf.back}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, rgba(63,56,51,${0.22 * lift}) 0%, transparent 60%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
