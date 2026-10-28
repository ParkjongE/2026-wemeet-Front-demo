import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { CalendarX, ChevronLeft, ChevronRight, CloudCheck, Lock, Pencil, ShieldCheck, Trash2, BookPlus, MessageCircle, Palette } from "lucide-react";
import { USE_MOCK, errorMessage } from "../api";
import { useCurrentChild } from "../auth/authContext";
import DecorPanel from "../components/Diary/DecorPanel";
import { DEFAULT_DECORATION } from "../components/Diary/decor";
import { DiaryDateHeading, DiaryPaper, DiaryView } from "../components/Diary/DiaryPaper";
import EditablePhotos from "../components/Diary/EditablePhotos";
import StickerLayer from "../components/Diary/StickerLayer";
import { MOODS } from "../components/Diary/stickerData";
import { MoodFace } from "../components/Diary/stickers";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorBox from "../components/common/ErrorBox";
import Skeleton from "../components/common/Skeleton";
import { useToast } from "../components/common/toastContext";
import { useDeleteDiary, useDiary, useSaveDiary } from "../hooks/useDiaries";
import { readDraft, useDiaryDraft } from "../hooks/useDiaryDraft";
import { usePhotoUploads } from "../hooks/usePhotoUploads";
import { useUnsavedChangesGuard } from "../hooks/useUnsavedChangesGuard";
import type { DiaryDecoration, DiaryEntry, Weather } from "../types";
import { addDays, formatMonthDay, todayString } from "../utils/date";
import { possessive } from "../utils/korean";
import { WEATHER_OPTIONS } from "../utils/weather";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function timeLabel(iso: string | number) {
  return new Date(iso).toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function DiaryEntryPage() {
  const { date } = useParams<{ date: string }>();
  const child = useCurrentChild();
  const navigate = useNavigate();
  const isValidDate = !!date && DATE_PATTERN.test(date);
  const today = todayString();
  const isFuture = isValidDate && date > today;
  const diaryQuery = useDiary(child.id, isValidDate && !isFuture ? date : undefined);

  if (!isValidDate) return <Navigate to="/" replace />;

  const dayNav = (
    <div className="flex items-center gap-1">
      <Link
        to={`/diary/${addDays(date, -1)}`}
        aria-label="전날 기록"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-brown/60 hover:bg-sand-light hover:text-brown"
      >
        <ChevronLeft size={20} />
      </Link>
      {date < today ? (
        <Link
          to={`/diary/${addDays(date, 1)}`}
          aria-label="다음 날 기록"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-brown/60 hover:bg-sand-light hover:text-brown"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <span className="h-11 w-11" />
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-sand-ink">{possessive(child.name)} 하루</p>
          <h1 className="mt-1 font-display text-[30px] text-brown sm:text-[28px]">
            {date === today ? "오늘의 기록" : `${formatMonthDay(date)}의 기록`}
          </h1>
          <p className="mt-2 text-sm text-brown/60">사진 한 장, 오늘 들은 한마디. 기억하고 싶은 만큼 남겨 주세요.</p>
        </div>
        {dayNav}
      </div>

      {isFuture ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl bg-white p-10 text-center shadow-card">
          <CalendarX size={32} className="text-brown/35" aria-hidden />
          <p className="text-lg font-bold text-brown">아직 오지 않은 날이에요</p>
          <p className="text-sm text-brown/60">기록은 오늘까지 남길 수 있어요.</p>
          <Button variant="secondary" className="mt-2" onClick={() => navigate(`/diary/${today}`)}>
            오늘 기록하러 가기
          </Button>
        </div>
      ) : diaryQuery.isPending ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" role="status" aria-label="기록을 불러오는 중">
          <Skeleton className="h-[560px] rounded-[22px]" />
          <Skeleton className="hidden h-72 lg:block" />
        </div>
      ) : diaryQuery.isError ? (
        <ErrorBox
          message={`기록을 불러오지 못했어요. ${errorMessage(diaryQuery.error)}`}
          onRetry={() => void diaryQuery.refetch()}
        />
      ) : (
        <DiaryEditor key={date} childId={child.id} childName={child.name} date={date} entry={diaryQuery.data} />
      )}
    </div>
  );
}

interface DiaryEditorProps {
  childId: string;
  childName: string;
  date: string;
  entry: DiaryEntry | null;
}

let stickerSeq = 0;

function DiaryEditor({ childId, childName, date, entry }: DiaryEditorProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const saveDiary = useSaveDiary(childId);
  const deleteDiary = useDeleteDiary(childId);

  // 새 기록이면 이 기기에 남아 있던 작성 중 내용을 이어서 보여준다.
  const [restored] = useState(() => (entry ? null : readDraft(childId, date)));
  const [isEditing, setIsEditing] = useState(!entry);
  const [text, setText] = useState(entry?.text ?? restored?.text ?? "");
  const [weather, setWeather] = useState<Weather | null>(entry?.weather ?? restored?.weather ?? null);
  const [moodTag, setMoodTag] = useState<string | null>(entry?.moodTag ?? restored?.moodTag ?? null);
  const [decoration, setDecoration] = useState<DiaryDecoration>(
    entry?.decoration ?? restored?.decoration ?? DEFAULT_DECORATION,
  );
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const uploads = usePhotoUploads(entry?.photos ?? []);
  const [showValidationError, setShowValidationError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);

  const savedPhotoIds = entry?.photos.map((p) => p.id) ?? [];
  const photosChanged =
    uploads.hasNew ||
    uploads.items.length !== savedPhotoIds.length ||
    uploads.items.some((item, i) => item.kind !== "saved" || item.photoId !== savedPhotoIds[i]);
  const baseDecoration = entry?.decoration ?? DEFAULT_DECORATION;
  const isDirty =
    isEditing &&
    (text !== (entry?.text ?? "") ||
      weather !== (entry?.weather ?? null) ||
      moodTag !== (entry?.moodTag ?? null) ||
      JSON.stringify(decoration) !== JSON.stringify(baseDecoration) ||
      photosChanged);
  const { blocker, allowLeave } = useUnsavedChangesGuard(isDirty && !saveDiary.isSuccess);
  const draft = useDiaryDraft(childId, date, { text, weather, moodTag, decoration }, isDirty && !saveDiary.isSuccess);

  const canSave = text.trim().length > 0 || uploads.items.length > 0;
  const isBusy = saveDiary.isPending || deleteDiary.isPending;

  // 글이 늘어나면 칸도 같이 늘린다.
  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 36 * 5)}px`;
  }, [text, isEditing]);

  const addSticker = (kind: string) => {
    const id = `sticker-${Date.now()}-${++stickerSeq}`;
    const spot = [
      [58, 9],
      [86, 40],
      [12, 52],
      [84, 76],
      [16, 96],
      [80, 112],
    ][decoration.stickers.length % 6];
    setDecoration((d) => ({
      ...d,
      stickers: [
        ...d.stickers,
        { id, kind, x: spot[0], y: spot[1], rotate: Math.round(Math.random() * 24 - 12), scale: 1 },
      ],
    }));
    setSelectedSticker(id);
  };

  const handleSave = () => {
    if (!canSave) {
      setShowValidationError(true);
      textarea.current?.focus();
      return;
    }
    if (uploads.isUploading || uploads.hasFailed || isBusy) return;
    saveDiary.mutate(
      {
        date,
        input: { text: text.trim(), weather, moodTag, photoIds: uploads.photoIds, decoration },
      },
      {
        onSuccess: () => {
          draft.clear();
          allowLeave();
          toast.show(entry ? "수정한 기록을 저장했어요." : `${possessive(childName)} 하루를 안전하게 저장했어요.`);
          setIsEditing(false);
          setSelectedSticker(null);
          saveDiary.reset();
        },
        onError: (error) => toast.show(errorMessage(error), "error"),
      },
    );
  };

  const handleCancelEdit = () => {
    uploads.reset(entry?.photos ?? []);
    setText(entry?.text ?? "");
    setWeather(entry?.weather ?? null);
    setMoodTag(entry?.moodTag ?? null);
    setDecoration(baseDecoration);
    setShowValidationError(false);
    setSelectedSticker(null);
    draft.clear();
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

  // ---------- 보기 ----------
  if (!isEditing && entry) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="animate-fade-up min-w-0">
          <DiaryView entry={entry} />
        </div>
        <aside className="space-y-3 lg:sticky lg:top-24">
          <div className="rounded-xl bg-white p-5 shadow-card ring-1 ring-hairline/70">
            <p className="flex items-center gap-2 text-sm font-semibold text-forest">
              <CloudCheck size={18} aria-hidden />
              저장한 기록
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-brown/55">
              마지막 저장 {timeLabel(entry.updatedAt)}
              <br />
              사진 {entry.photos.length}장 · 글 {entry.text.length}자
            </p>
            <Button variant="primary" onClick={() => setIsEditing(true)} className="mt-4 w-full whitespace-nowrap">
              <Pencil size={16} aria-hidden />
              기록 수정하기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="mt-2 w-full text-brown/50 hover:bg-error-light hover:text-error"
            >
              <Trash2 size={15} aria-hidden />이 기록 삭제
            </Button>
          </div>
          <Link to="/storybooks/new" state={{ draft: { periodStart: date, periodEnd: date } }} className="service-panel flex items-center gap-3 p-5 text-sm font-semibold"><BookPlus size={20} className="text-sand-ink" /><span>이 하루로 동화 만들기<span className="mt-1 block text-xs font-normal text-brown/60">남긴 기록에 전하고 싶은 마음을 더해요</span></span></Link>
          <p className="flex items-center gap-1.5 px-2 text-xs text-brown/45">
            <Lock size={13} aria-hidden />
            {USE_MOCK ? "체험 기록은 이 브라우저에 보관돼요." : "이 기록은 로그인한 계정에서 볼 수 있어요."}
          </p>
        </aside>
        <ConfirmDialog
          open={confirmDelete}
          title="이 날의 기록을 지울까요?"
          description="사진과 글, 꾸미기가 모두 사라지고 되돌릴 수 없어요. 이 기록으로 만든 동화는 그대로 남아요."
          confirmLabel="삭제하기"
          destructive
          pending={deleteDiary.isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      </div>
    );
  }

  // ---------- 쓰기·꾸미기 ----------
  return (
    <>
      {restored && isEditing && !entry && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-ocean-light px-4 py-3 text-sm text-ocean-deep">
          <span>
            {timeLabel(restored.savedAt)}에 쓰던 내용을 이어서 불러왔어요.
          </span>
          <button
            type="button"
            className="min-h-9 rounded-lg px-2 font-semibold underline-offset-2 hover:underline"
            onClick={() => {
              draft.clear();
              setText("");
              setWeather(null);
              setMoodTag(null);
              setDecoration(DEFAULT_DECORATION);
            }}
          >
            새로 쓰기
          </button>
        </div>
      )}

      <div className="sticky top-16 z-20 mb-5 flex items-center justify-between gap-3 border-y border-hairline bg-canvas px-1 py-3 lg:hidden">
        <p className="text-xs text-brown/65">{draft.savedAt ? "이 기기에 임시 저장됨" : "작성 중인 기록"}<span className="mt-1 block text-brown/50">사진 {uploads.items.length}장 · {text.length}자</span></p>
        <Button onClick={handleSave} loading={saveDiary.isPending} disabled={uploads.isUploading || uploads.hasFailed || isBusy}>기록 저장</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0" onPointerDown={() => setSelectedSticker(null)}>
          <DiaryPaper
            paper={decoration.paper}
            header={
              <>
                <DiaryDateHeading date={date} />
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1" role="group" aria-label="오늘 날씨 (선택)">
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
                          title={option.label}
                          className={[
                            "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                            active ? "scale-110 bg-white shadow-card ring-2 ring-sand" : "opacity-55 hover:bg-white/70 hover:opacity-100",
                          ].join(" ")}
                        >
                          <Icon size={21} className={option.colorClass} />
                        </button>
                      );
                    })}
                  </div>
                  <div className="scrollbar-none -mx-1 flex items-center gap-1 overflow-x-auto px-1" role="group" aria-label="오늘 기분 (선택)">
                    {MOODS.map((mood) => {
                      const active = moodTag === mood.tag;
                      return (
                        <button
                          key={mood.tag}
                          type="button"
                          onClick={() => setMoodTag(active ? null : mood.tag)}
                          aria-pressed={active}
                          className={[
                            "flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-1 py-1 transition-all",
                            active ? "bg-white shadow-card ring-2 ring-sand" : "opacity-60 hover:opacity-100",
                          ].join(" ")}
                        >
                          <MoodFace tag={mood.tag} className="h-8 w-8" />
                          <span className="text-[10px] font-medium text-brown/70">{mood.tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            }
            overlay={
              <StickerLayer
                stickers={decoration.stickers}
                editable
                selectedId={selectedSticker}
                onSelect={setSelectedSticker}
                onChange={(stickers) => setDecoration((d) => ({ ...d, stickers }))}
              />
            }
          >

            <label htmlFor="diary-text" className="mb-3 mt-6 block text-sm font-semibold text-brown/70">오늘 기억하고 싶은 순간</label>
            <textarea
              id="diary-text"
              ref={textarea}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setShowValidationError(false);
              }}
              maxLength={1000}
              readOnly={isBusy}
              placeholder={`${childName}의 오늘은 어땠나요? 한 줄이어도 충분해요.\n예) 놀이터에서 친구에게 먼저 장난감을 빌려줬어요.`}
              aria-invalid={showValidationError}
              aria-describedby={showValidationError ? "diary-content-error" : undefined}
              className="ruled-text block min-h-[180px] w-full resize-none overflow-hidden bg-transparent font-handwriting text-[21px] text-brown outline-none placeholder:text-brown/50"
            />
            {showValidationError && <p id="diary-content-error" role="alert" className="mt-2 text-sm text-error">사진이나 글을 하나 이상 남겨 주세요.</p>}
            <div className="mt-2 flex justify-end text-xs text-brown/40">{text.length}/1000</div>
            <p className="mt-7 text-sm font-semibold text-brown/70">함께 남길 사진 <span className="font-normal text-brown/50">선택</span></p>
            <EditablePhotos
              items={uploads.items}
              frame={decoration.frame}
              onAdd={uploads.add}
              onRemove={uploads.remove}
              onRetry={uploads.retry}
              disabled={isBusy}
            />
          </DiaryPaper>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">


          <div className="service-panel p-5">
            <div className="mb-4 border-b border-hairline pb-4"><p className="service-eyebrow">기록 보관</p><p className="mt-2 text-sm text-brown/70">사진 {uploads.items.length}장 · 글 {text.length}자</p><p className="mt-1 text-xs text-brown/60">{USE_MOCK ? "체험 버전 · 이 브라우저에 저장됩니다" : "저장하면 계정에서 다시 볼 수 있어요"}</p></div>
            {saveDiary.isError && (
              <p role="alert" className="mb-3 rounded-xl bg-error-light px-3 py-2 text-sm text-brown">
                저장하지 못했어요. {errorMessage(saveDiary.error)} 쓰던 내용은 이 기기에 그대로 있어요.
              </p>
            )}
            {saveHint && <p className="mb-3 text-xs text-brown/60">{saveHint}</p>}
            <Button
              size="lg"
              onClick={handleSave}
              loading={saveDiary.isPending}
              disabled={uploads.isUploading || uploads.hasFailed || isBusy}
              className="w-full"
            >
              {saveDiary.isPending ? "저장하는 중…" : entry ? "수정한 기록 저장하기" : "오늘의 기록 저장하기"}
            </Button>
            {entry && (
              <Button variant="ghost" onClick={handleCancelEdit} disabled={isBusy} className="mt-2 w-full">
                고치지 않고 돌아가기
              </Button>
            )}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-brown/50">
              <ShieldCheck size={14} className="text-forest" aria-hidden />
              {draft.savedAt ? `이 기기에 임시 저장됨 · ${timeLabel(draft.savedAt)}` : "글과 꾸미기는 이 기기에 임시 저장됩니다"}
            </p>
          </div>
          <section className="service-panel p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><MessageCircle size={17} className="text-sand-ink" />오늘의 작은 질문</h2>
            <p className="mt-3 font-display text-lg">오늘 아이가 한 말 중<br />기억해 두고 싶은 말은요?</p>
            <p className="mt-2 text-xs leading-relaxed text-brown/60">재미있었던 놀이, 처음 해낸 일, 함께 웃었던 순간도 좋아요.</p>
            <button type="button" onClick={() => textarea.current?.focus()} className="mt-3 min-h-10 text-sm font-semibold text-ocean-deep">기록에 적어 보기 →</button>
          </section>
          <details className="group service-panel overflow-hidden">
            <summary className="flex min-h-16 cursor-pointer items-center gap-2 px-5 text-sm font-semibold"><Palette size={17} className="text-sand-ink" />종이와 스티커 꾸미기<span className="ml-auto text-xs font-normal text-brown/50">선택 +</span></summary>
          <DecorPanel
            decoration={decoration}
            onAddSticker={addSticker}
            onChange={(patch) => setDecoration((d) => ({ ...d, ...patch }))}
          />
          </details>
        </aside>
      </div>

      <ConfirmDialog
        open={blocker.state === "blocked"}
        title="아직 저장하지 않았어요"
        description="쓰던 글과 꾸미기는 이 기기에 임시로 남아 있어요. 다음에 이 날짜를 열면 이어서 쓸 수 있어요."
        confirmLabel="나가기"
        cancelLabel="계속 쓰기"
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </>
  );
}
