import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useDiary } from "../context/useDiary";
import PhotoUploader from "../components/DiaryForm/PhotoUploader";
import Polaroid from "../components/DiaryForm/Polaroid";
import AppHeader from "../components/AppHeader";
import type { Weather } from "../types";
import { WEATHER_OPTIONS, getWeatherOption } from "../utils/weather";

function formatDisplayDate(dateStr: string): { year: string; monthDay: string; weekday: string } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return {
    year: `${y}년`,
    monthDay: `${m}월 ${d}일`,
    weekday: date.toLocaleDateString("ko-KR", { weekday: "long" }),
  };
}

export default function DiaryEntryPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { getEntry, upsertEntry } = useDiary();

  const existingEntry = date ? getEntry(date) : undefined;
  const [isEditing, setIsEditing] = useState(!existingEntry);
  const [text, setText] = useState(existingEntry?.text ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>(existingEntry?.imageUrls ?? []);
  const [weather, setWeather] = useState<Weather | undefined>(existingEntry?.weather);
  const [showValidationError, setShowValidationError] = useState(false);

  const imageUrlsRef = useRef(imageUrls);
  imageUrlsRef.current = imageUrls;
  const existingEntryRef = useRef(existingEntry);
  existingEntryRef.current = existingEntry;
  const justSavedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (justSavedRef.current) return;
      const savedUrls = new Set(existingEntryRef.current?.imageUrls ?? []);
      imageUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:") && !savedUrls.has(url)) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  useEffect(() => {
    setIsEditing(!existingEntry);
    setText(existingEntry?.text ?? "");
    setImageUrls(existingEntry?.imageUrls ?? []);
    setWeather(existingEntry?.weather);
    setShowValidationError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (!date) {
    return null;
  }

  const { year, monthDay, weekday } = formatDisplayDate(date);
  const selectedWeather = getWeatherOption(weather);
  const canSave = text.trim().length > 0 || imageUrls.length > 0;

  const revokeUnsavedBlobUrls = (urls: string[]) => {
    const savedUrls = new Set(existingEntry?.imageUrls ?? []);
    urls.forEach((url) => {
      if (url.startsWith("blob:") && !savedUrls.has(url)) {
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleSave = () => {
    if (!canSave) {
      setShowValidationError(true);
      return;
    }
    justSavedRef.current = true;
    upsertEntry({
      date,
      text: text.trim(),
      imageUrls,
      moodTag: existingEntry?.moodTag,
      weather,
    });
    navigate("/");
  };

  const handleCancelEdit = () => {
    revokeUnsavedBlobUrls(imageUrls);
    setIsEditing(false);
    setText(existingEntry?.text ?? "");
    setImageUrls(existingEntry?.imageUrls ?? []);
    setWeather(existingEntry?.weather);
    setShowValidationError(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:max-w-xl lg:max-w-2xl lg:py-10">
      <AppHeader title="오늘의 기록" />

      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
        {/* diary header strip: date | weather */}
        <div className="grid grid-cols-2 divide-x divide-dashed divide-mint border-b-4 border-double border-mint">
          <div className="px-4 py-4 text-center">
            <p className="font-handwriting text-xs text-brown/50">{year}</p>
            <p className="font-handwriting text-2xl text-brown">{monthDay}</p>
            <p className="text-xs text-brown/50">{weekday}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 px-4 py-4">
            {isEditing ? (
              <div className="flex flex-wrap justify-center gap-1.5">
                {WEATHER_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = weather === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setWeather(active ? undefined : option.value)}
                      aria-label={option.label}
                      aria-pressed={active}
                      className={[
                        "rounded-full p-2 transition-colors",
                        active ? "bg-yellow-light" : "hover:bg-mint-light",
                      ].join(" ")}
                    >
                      <Icon size={20} className={option.colorClass} />
                    </button>
                  );
                })}
              </div>
            ) : selectedWeather ? (
              <>
                <selectedWeather.icon size={26} className={selectedWeather.colorClass} />
                <p className="font-handwriting text-sm text-brown/60">{selectedWeather.label}</p>
              </>
            ) : (
              <p className="text-xs text-brown/30">날씨 없음</p>
            )}
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {isEditing ? (
            <>
              <div>
                <p className="mb-1 text-sm font-semibold text-brown">오늘의 사진을 올려주세요</p>
                <p className="mb-2 text-xs text-brown/50">여러 장을 함께 남길 수 있어요.</p>
                <PhotoUploader imageUrls={imageUrls} onChange={setImageUrls} />
              </div>

              <div>
                <p className="mb-1 text-sm font-semibold text-brown">오늘 어떤 일이 있었나요?</p>
                <div className="ruled-paper rounded-lg bg-yellow-light/40 px-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="친구에게 먼저 장난감을 빌려줬어요. 둘이 함께 노는 모습이 참 예뻤어요."
                    rows={6}
                    className="w-full resize-none bg-transparent font-handwriting text-lg text-brown outline-none placeholder:font-body placeholder:text-sm placeholder:text-brown/40"
                  />
                </div>
                <p className="mt-1.5 text-xs text-brown/50">
                  사진만 남겨도, 짧은 한 줄만 적어도 괜찮아요.
                </p>
              </div>

              {showValidationError && (
                <p role="alert" className="text-sm font-medium text-coral-deep">
                  사진이나 이야기를 하나 이상 남겨주세요.
                </p>
              )}

              <div className="flex justify-end gap-2">
                {existingEntry && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-full px-5 py-2 text-sm font-medium text-brown/60 hover:bg-gray-100"
                  >
                    취소
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-coral px-6 py-2 text-sm font-medium text-white shadow"
                >
                  {existingEntry ? "수정한 기록 저장" : "기록 남기기"}
                </button>
              </div>
            </>
          ) : existingEntry ? (
            <>
              {existingEntry.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4 px-2 py-2 sm:grid-cols-3">
                  {existingEntry.imageUrls.map((url, i) => (
                    <Polaroid key={url} src={url} alt={`${date} 기록 사진 ${i + 1}`} index={i} />
                  ))}
                </div>
              )}
              <div className="ruled-paper rounded-lg bg-yellow-light/40 px-3 py-1">
                <p className="whitespace-pre-wrap font-handwriting text-lg leading-9 text-brown">
                  {existingEntry.text}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 rounded-full bg-yellow px-5 py-2 text-sm font-medium text-brown shadow"
                >
                  <Pencil size={14} />
                  수정
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
