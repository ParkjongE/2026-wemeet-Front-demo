import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CalendarX, Pencil, Trash2 } from "lucide-react";
import { errorMessage } from "../api";
import { useCurrentChild } from "../auth/authContext";
import PhotoUploader from "../components/DiaryForm/PhotoUploader";
import Polaroid from "../components/DiaryForm/Polaroid";
import AppHeader from "../components/AppHeader";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import { useToast } from "../components/common/toastContext";
import { useDeleteDiary, useDiary, useSaveDiary } from "../hooks/useDiaries";
import { usePhotoUploads } from "../hooks/usePhotoUploads";
import { useUnsavedChangesGuard } from "../hooks/useUnsavedChangesGuard";
import type { DiaryEntry, Weather } from "../types";
import { todayString } from "../utils/date";
import { WEATHER_OPTIONS, getWeatherOption } from "../utils/weather";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function formatDisplayDate(dateStr: string): { year: string; monthDay: string; weekday: string } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return {
    year: `${y}년`,
    monthDay: `${m}월 ${d}일`,
    weekday: date.toLocaleDateString("ko-KR", { weekday: "long" }),
  };
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:max-w-xl lg:max-w-2xl lg:py-10">
      <AppHeader title="하루 기록" />
      {children}
    </div>
  );
}

export default function DiaryEntryPage() {
  const { date } = useParams<{ date: string }>();
  const child = useCurrentChild();
  const navigate = useNavigate();
  const isValidDate = !!date && DATE_PATTERN.test(date);
  const isFuture = isValidDate && date > todayString();
  const diaryQuery = useDiary(child.id, isValidDate && !isFuture ? date : undefined);

  if (!isValidDate) return <Navigate to="/" replace />;

  if (isFuture) {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-md">
          <CalendarX size={32} className="text-brown/40" aria-hidden />
          <p className="font-story text-lg text-brown">아직 오지 않은 날이에요</p>
          <p className="text-sm text-brown/60">미래 날짜에는 기록할 수 없어요.</p>
          <Button variant="ghost" className="mt-2" onClick={() => navigate(`/diary/${todayString()}`)}>
            오늘 기록하러 가기
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {diaryQuery.isPending ? (
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-md" role="status" aria-label="기록을 불러오는 중">
          <Skeleton className="h-20" />
          <Skeleton className="h-40" />
          <Skeleton className="h-24" />
        </div>
      ) : diaryQuery.isError ? (
        <ErrorBox
          message={`기록을 불러오지 못했어요. ${errorMessage(diaryQuery.error)}`}
          onRetry={() => void diaryQuery.refetch()}
        />
      ) : (
        <DiaryEditor key={date} childId={child.id} date={date} entry={diaryQuery.data} />
      )}
    </PageShell>
  );
}

interface DiaryEditorProps {
  childId: string;
  date: string;
  entry: DiaryEntry | null;
}

function DiaryEditor({ childId, date, entry }: DiaryEditorProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const saveDiary = useSaveDiary(childId);
  const deleteDiary = useDeleteDiary(childId);

  const [isEditing, setIsEditing] = useState(!entry);
  const [text, setText] = useState(entry?.text ?? "");
  const [weather, setWeather] = useState<Weather | null>(entry?.weather ?? null);
  const uploads = usePhotoUploads(entry?.photos ?? []);
  const [showValidationError, setShowValidationError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const savedPhotoIds = entry?.photos.map((p) => p.id) ?? [];
  const photosChanged =
    uploads.hasNew ||
    uploads.items.length !== savedPhotoIds.length ||
    uploads.items.some((item, i) => item.kind !== "saved" || item.photoId !== savedPhotoIds[i]);
  const isDirty =
    isEditing && (text !== (entry?.text ?? "") || weather !== (entry?.weather ?? null) || photosChanged);
  const { blocker, allowLeave } = useUnsavedChangesGuard(isDirty && !saveDiary.isSuccess);

  const { year, monthDay, weekday } = formatDisplayDate(date);
  const selectedWeather = getWeatherOption(weather);
  const canSave = text.trim().length > 0 || uploads.items.length > 0;
  const isBusy = saveDiary.isPending || deleteDiary.isPending;

  const handleSave = () => {
    if (!canSave) {
      setShowValidationError(true);
      return;
    }
    if (uploads.isUploading || uploads.hasFailed || isBusy) return;
    saveDiary.mutate(
      {
        date,
        input: { text: text.trim(), weather, moodTag: entry?.moodTag ?? null, photoIds: uploads.photoIds },
      },
      {
        onSuccess: () => {
          toast.show(entry ? "기록을 수정했어요." : "기록을 남겼어요.");
          allowLeave();
          navigate("/");
        },
        onError: (error) => toast.show(errorMessage(error), "error"),
      },
    );
  };

  const handleCancelEdit = () => {
    uploads.reset(entry?.photos ?? []);
    setText(entry?.text ?? "");
    setWeather(entry?.weather ?? null);
    setShowValidationError(false);
    saveDiary.reset();
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteDiary.mutate(date, {
      onSuccess: () => {
        toast.show("기록을 삭제했어요.");
        allowLeave();
        navigate("/");
      },
      onError: (error) => {
        setConfirmDelete(false);
        toast.show(errorMessage(error), "error");
      },
    });
  };

  const saveHint = uploads.isUploading
    ? "사진을 올리는 중이에요. 끝나면 저장할 수 있어요."
    : uploads.hasFailed
      ? "올리지 못한 사진이 있어요. 다시 올리거나 빼 주세요."
      : null;

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
        {/* diary header strip: date | weather */}
        <div className="grid grid-cols-2 divide-x divide-dashed divide-mint border-b-4 border-double border-mint">
          <div className="px-4 py-4 text-center">
            <p className="font-handwriting text-xs text-brown/50">{year}</p>
            <p className="font-handwriting text-2xl text-brown">{monthDay}</p>
            <p className="text-xs text-brown/50">{weekday}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 px-2 py-4">
            {isEditing ? (
              <div className="flex flex-wrap justify-center gap-0.5">
                {WEATHER_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = weather === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setWeather(active ? null : option.value)}
                      aria-label={option.label}
                      aria-pressed={active}
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
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
                <p className="mb-2 text-xs text-brown/50">고르면 바로 올라가요. 최대 5장까지 남길 수 있어요.</p>
                <PhotoUploader
                  items={uploads.items}
                  onAdd={uploads.add}
                  onRemove={uploads.remove}
                  onRetry={uploads.retry}
                  disabled={isBusy}
                />
              </div>

              <div>
                <label htmlFor="diary-text" className="mb-1 block text-sm font-semibold text-brown">
                  오늘 어떤 일이 있었나요?
                </label>
                <div className="ruled-paper rounded-lg bg-yellow-light/40 px-3">
                  <textarea
                    id="diary-text"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setShowValidationError(false);
                    }}
                    maxLength={1000}
                    readOnly={isBusy}
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
              {saveDiary.isError && (
                <p role="alert" className="rounded-xl bg-coral-light/60 px-4 py-3 text-sm text-brown">
                  저장하지 못했어요. {errorMessage(saveDiary.error)} 입력한 내용은 그대로 있어요.
                </p>
              )}
              {saveHint && <p className="text-right text-xs text-brown/60">{saveHint}</p>}

              <div className="flex justify-end gap-2">
                {entry && (
                  <Button variant="ghost" onClick={handleCancelEdit} disabled={isBusy} className="text-sm">
                    취소
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  loading={saveDiary.isPending}
                  disabled={uploads.isUploading || uploads.hasFailed}
                  className="text-sm"
                >
                  {saveDiary.isPending ? "저장하는 중…" : entry ? "수정한 기록 저장" : "기록 남기기"}
                </Button>
              </div>
            </>
          ) : entry ? (
            <>
              {entry.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 px-2 py-2 sm:grid-cols-3">
                  {entry.photos.map((photo, i) => (
                    <Polaroid key={photo.id} src={photo.url} alt={`${date} 기록 사진 ${i + 1}`} index={i} />
                  ))}
                </div>
              )}
              {entry.text && (
                <div className="ruled-paper rounded-lg bg-yellow-light/40 px-3 py-1">
                  <p className="whitespace-pre-wrap font-handwriting text-lg leading-9 text-brown">
                    {entry.text}
                  </p>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <Button variant="danger" onClick={() => setConfirmDelete(true)} className="text-sm">
                  <Trash2 size={16} aria-hidden />
                  삭제
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow text-sm hover:bg-yellow/80"
                >
                  <Pencil size={14} aria-hidden />
                  수정
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="이 날의 기록을 지울까요?"
        description="사진과 글이 모두 사라지고 되돌릴 수 없어요."
        confirmLabel="삭제하기"
        destructive
        pending={deleteDiary.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmDialog
        open={blocker.state === "blocked"}
        title="저장하지 않은 내용이 있어요"
        description="이 화면을 나가면 작성한 내용이 사라져요."
        confirmLabel="나가기"
        cancelLabel="계속 쓰기"
        destructive
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </>
  );
}
