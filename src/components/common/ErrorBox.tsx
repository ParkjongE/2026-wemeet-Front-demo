import { RotateCcw, CloudOff } from "lucide-react";

interface ErrorBoxProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBox({ message, onRetry, className = "" }: ErrorBoxProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-3 rounded-xl border border-error/15 bg-error-light/50 p-6 text-center ${className}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-error shadow-sm">
        <CloudOff size={20} aria-hidden />
      </span>
      <p className="text-sm leading-relaxed text-brown/80">{message ?? "잠시 연결이 원활하지 않아요."}</p>
      <p className="text-xs text-brown/50">이미 저장된 기록은 안전하게 보관되어 있어요.</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex min-h-11 items-center gap-1.5 rounded-xl bg-white px-5 text-sm font-semibold text-brown shadow-sm ring-1 ring-hairline hover:bg-sand-light"
        >
          <RotateCcw size={16} aria-hidden />
          다시 불러오기
        </button>
      )}
    </div>
  );
}
