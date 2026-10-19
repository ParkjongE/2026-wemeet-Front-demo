import { mascot } from "../../mock/illustrations";
import ErrorBox from "./ErrorBox";

interface FullPageStatusProps {
  kind: "loading" | "error";
  message?: string;
  onRetry?: () => void;
  secondaryAction?: { label: string; onClick: () => void };
}

export default function FullPageStatus({
  kind,
  message,
  onRetry,
  secondaryAction,
}: FullPageStatusProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
      {kind === "loading" ? (
        <div role="status" aria-live="polite">
          <img src={mascot.wave} alt="" className="animate-mascot-bob mx-auto h-20 w-20" />
          <p className="mt-3 text-sm text-brown/60">{message ?? "잠시만 기다려 주세요…"}</p>
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
