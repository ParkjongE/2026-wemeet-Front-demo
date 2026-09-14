import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Storybook } from "../../types";

interface StorybookViewerProps {
  storybook: Storybook;
  footerActions?: ReactNode;
}

const SWIPE_THRESHOLD = 40;

export default function StorybookViewer({ storybook, footerActions }: StorybookViewerProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const isFirst = pageIndex === 0;
  const isLast = pageIndex === storybook.pages.length - 1;
  const page = storybook.pages[pageIndex];

  const pageCount = storybook.pages.length;
  const goPrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const goNext = () => setPageIndex((i) => Math.min(pageCount - 1, i + 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPageIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setPageIndex((i) => Math.min(pageCount - 1, i + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageCount]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  };

  return (
    <div className="mx-auto w-full max-w-md lg:max-w-3xl">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden rounded-2xl bg-white shadow-md lg:flex lg:items-stretch"
      >
        <img
          src={page.imageUrl}
          alt={`${storybook.title} ${pageIndex + 1}페이지 삽화`}
          loading={pageIndex === 0 ? undefined : "lazy"}
          className="h-56 w-full object-cover sm:h-72 lg:h-auto lg:w-1/2"
        />
        <div className="flex min-h-24 items-center p-5 lg:w-1/2 lg:p-8">
          <p className="font-story whitespace-pre-line text-base leading-relaxed text-brown lg:text-lg">
            {page.text}
          </p>
        </div>

        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="이전 페이지"
          className="absolute left-2 top-24 -translate-y-1/2 rounded-full bg-white/90 p-2 text-brown shadow disabled:opacity-30 sm:top-32 lg:top-1/2"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={isLast}
          aria-label="다음 페이지"
          className="absolute right-2 top-24 -translate-y-1/2 rounded-full bg-white/90 p-2 text-brown shadow disabled:opacity-30 sm:top-32 lg:top-1/2"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-xs text-brown/50">
          {pageIndex + 1} / {storybook.pages.length}
        </span>
        <div className="flex gap-2">
          {storybook.pages.map((p, i) => (
            <button
              key={p.imageUrl + i}
              type="button"
              onClick={() => setPageIndex(i)}
              aria-label={`${i + 1}페이지로 이동`}
              aria-current={i === pageIndex}
              className={[
                "h-2.5 w-2.5 rounded-full transition-colors",
                i === pageIndex ? "bg-coral" : "bg-gray-300",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {isLast && footerActions && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">{footerActions}</div>
      )}
    </div>
  );
}
