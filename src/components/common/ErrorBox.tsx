import { RotateCcw, TriangleAlert } from "lucide-react";

interface ErrorBoxProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBox({ message, onRetry, className = "" }: ErrorBoxProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-3 rounded-2xl bg-coral-light/60 p-5 text-center ${className}`}
    >
      <TriangleAlert className="text-coral-deep" size={24} aria-hidden />
      <p className="text-sm text-brown">{message ?? "문제가 생겼어요. 잠시 후 다시 시도해 주세요."}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex min-h-11 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-medium text-brown shadow-sm hover:bg-mint-light"
        >
          <RotateCcw size={16} aria-hidden />
          다시 시도
        </button>
      )}
    </div>
  );
}
