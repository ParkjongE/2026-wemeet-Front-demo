import { BrandMark } from "../layout/Brand";
import ErrorBox from "./ErrorBox";

interface FullPageStatusProps {
  kind: "loading" | "error";
  message?: string;
  onRetry?: () => void;
  secondaryAction?: { label: string; onClick: () => void };
}

export default function FullPageStatus({ kind, message, onRetry, secondaryAction }: FullPageStatusProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      {kind === "loading" ? (
        <div role="status" aria-live="polite" className="flex flex-col items-center">
          <BrandMark className="animate-bob h-12 w-12" />
          <p className="mt-4 text-sm text-brown/60">{message ?? "잠시만 기다려 주세요…"}</p>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <ErrorBox message={message} onRetry={onRetry} />
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="mt-3 min-h-11 text-sm text-brown/60 underline-offset-2 hover:underline"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
