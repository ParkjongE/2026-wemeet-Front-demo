import type { ReactNode } from "react";
import type { DiaryEntry, PaperTheme, PhotoFrame as FrameStyle } from "../../types";
import { DEFAULT_DECORATION, formatDiaryDate, paperClass } from "./decor";
import { getWeatherOption } from "../../utils/weather";
import PhotoFrame from "./PhotoFrame";
import StickerLayer from "./StickerLayer";
import { MoodFace } from "./stickers";

interface DiaryPaperProps {
  paper: PaperTheme;
  header: ReactNode;
  children: ReactNode;
  overlay?: ReactNode;
  className?: string;
}

// 일기장 한 장. 종이 질감 위에 머리말, 사진, 글, 스티커를 올린다.
export function DiaryPaper({ paper, header, children, overlay, className = "" }: DiaryPaperProps) {
  return (
    <div
      className={[
        "relative overflow-visible rounded-[22px] shadow-lift ring-1 ring-black/[0.04] [container-type:inline-size]",
        paperClass(paper),
        className,
      ].join(" ")}
    >
      {/* 일기장 바인딩 구멍 */}
      <div className="pointer-events-none absolute inset-y-6 left-3 hidden flex-col justify-between sm:flex" aria-hidden>
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-canvas shadow-[inset_0_1px_2px_rgba(63,56,51,0.25)]" />
        ))}
      </div>
      <div className="relative px-5 pb-8 pt-6 sm:pl-12 sm:pr-9 sm:pt-8">
        {header}
        {children}
      </div>
      {overlay}
    </div>
  );
}

export function DiaryDateHeading({ date, right }: { date: string; right?: ReactNode }) {
  const { year, month, day, weekday } = formatDiaryDate(date);
  return (
    <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-brown/10 pb-4">
      <div>
        <p className="text-xs font-semibold tracking-wider text-brown/45">{year}</p>
        <p className="font-handwriting text-[34px] font-bold leading-none text-brown">
          {month}월 {day}일
        </p>
        <p className="mt-1 text-sm text-brown/55">{weekday}</p>
      </div>
      {right}
    </div>
  );
}

export function PhotoCollage({
  photos,
  frame,
  date,
}: {
  photos: { id: string; url: string }[];
  frame: FrameStyle;
  date: string;
}) {
  if (photos.length === 0) return null;
  const layout =
    photos.length === 1
      ? "mx-auto max-w-[78%] sm:max-w-[62%]"
      : photos.length === 2
        ? "grid grid-cols-2 gap-5"
        : "grid grid-cols-2 gap-5 sm:grid-cols-3";
  return (
    <div className={`my-6 ${layout}`}>
      {photos.map((photo, i) => (
        <PhotoFrame key={photo.id} src={photo.url} alt={`${date} 사진 ${i + 1}`} frame={frame} index={i} />
      ))}
    </div>
  );
}

// 저장된 기록을 꾸민 그대로 보여준다.
export function DiaryView({ entry }: { entry: DiaryEntry }) {
  const decoration = entry.decoration ?? DEFAULT_DECORATION;
  const weather = getWeatherOption(entry.weather);
  return (
    <DiaryPaper
      paper={decoration.paper}
      header={
        <DiaryDateHeading
          date={entry.date}
          right={
            <div className="flex items-center gap-2">
              {weather && (
                <span className="flex flex-col items-center gap-0.5 text-[11px] text-brown/55">
                  <weather.icon size={26} className={weather.colorClass} aria-hidden />
                  {weather.label}
                </span>
              )}
              {entry.moodTag && (
                <span className="flex flex-col items-center gap-0.5 text-[11px] text-brown/55">
                  <MoodFace tag={entry.moodTag} className="h-8 w-8" />
                  {entry.moodTag}
                </span>
              )}
            </div>
          }
        />
      }
      overlay={<StickerLayer stickers={decoration.stickers} />}
    >
      <PhotoCollage photos={entry.photos} frame={decoration.frame} date={entry.date} />
      {entry.text && (
        <p className="ruled-text mt-4 whitespace-pre-wrap font-handwriting text-[21px] text-brown">{entry.text}</p>
      )}
    </DiaryPaper>
  );
}
